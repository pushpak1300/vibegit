/* eslint-disable max-depth */
/* eslint-disable n/no-process-exit */
 
 
/* eslint-disable @typescript-eslint/no-explicit-any */
import {Command, Flags} from '@oclif/core'
import {Config} from '@oclif/core'
import bodyParser from 'body-parser'
import cors from 'cors'
import express, {Request, Response} from 'express'
import fs from 'node:fs'
import path from 'node:path'

interface Tool {
  description: string;
  inputSchema: {
    properties: Record<string, unknown>;
    required: string[];
    type: string;
  };
  name: string;
}

export default class Mcp extends Command {
  static override description = 'Start an MCP server that exposes oclif commands as tools'
static override examples = [
    '<%= config.bin %> mcp',
    '<%= config.bin %> mcp --port 3000',
  ]
  static override flags = {
    port: Flags.integer({
      char: 'p',
      default: 3333,
      description: 'Port to run MCP server on',
    }),
  }
  private commands: Map<string, unknown> = new Map()

  public async run(): Promise<void> {
    const { flags } = await this.parse(Mcp)
    const {port} = flags

    this.log('Loading oclif commands...')
    await this.loadCommands()
    this.log(`Loaded ${this.commands.size} commands`)

    this.setupMCPServer(port)
  }

  private getToolSchemas(): Tool[] {
    const tools: Tool[] = []
    
    for (const [id, Command] of this.commands.entries()) {
      // Create schema for command arguments and flags
      const properties: Record<string, unknown> = {}
      const required: string[] = []

      // Add arguments
      if ((Command as any).args) {
        for (const [name, arg] of Object.entries((Command as any).args)) {
          properties[name] = {
            description: (arg as any).description || `Argument: ${name}`,
            type: 'string',
          }
          
          if ((arg as any).required) {
            required.push(name)
          }
        }
      }

      // Add flags
      if ((Command as any).flags) {
        for (const [name, flag] of Object.entries((Command as any).flags)) {
          let type = 'string'
          
          if ((flag as any).type === 'boolean') {
            type = 'boolean'
          } else if ((flag as any).type === 'integer' || (flag as any).type === 'number') {
            type = 'number'
          }
          
          properties[name] = {
            description: (flag as any).description || `Flag: ${name}`,
            type,
          }
          
          // Include any default values
          if ((flag as any).default !== undefined) {
            const propObj = properties[name] as Record<string, unknown>
            propObj.default = (flag as any).default
          }
        }
      }

      // Create the tool schema
      tools.push({
        description: (Command as any).description || `Run the ${id} command`,
        inputSchema: {
          properties,
          required,
          type: 'object',
        },
        name: id,
      })
    }

    return tools
  }

  private async loadCommands(): Promise<void> {
    try {
      // Get the root config
      const config = await Config.load()
      
      // Find the correct project root directory
      // First try to find it from the current working directory
      const projectRoot = process.cwd()
      this.log(`Project root: ${projectRoot}`)
      
      // Get the commands directory - look for both compiled and source dirs
      let commandsDir = path.join(projectRoot, 'dist', 'commands')
      if (!fs.existsSync(commandsDir)) {
        commandsDir = path.join(projectRoot, 'src', 'commands')
      }
      
      this.log(`Looking for commands in: ${commandsDir}`)
      
      if (fs.existsSync(commandsDir)) {
        // Map to keep track of command file paths
        const commandFiles = new Map<string, string>()
        
        // Helper function to recursively scan for command files
        const scanDir = (dir: string, baseId = ''): void => {
          const files = fs.readdirSync(dir)
          
          for (const file of files) {
            const filePath = path.join(dir, file)
            const stat = fs.statSync(filePath)
            
            if (stat.isDirectory()) {
              // For directories, recurse with updated base ID
              scanDir(filePath, baseId ? `${baseId}:${file}` : file)
            } else if (file.endsWith('.ts') || file.endsWith('.js')) {
              // For command files, add to our map
              const cmdName = file.replace(/\.(ts|js)$/, '')
              const cmdId = baseId ? `${baseId}:${cmdName}` : cmdName
              
              // Skip the MCP command itself to avoid recursion
              if (cmdId !== 'mcp') {
                commandFiles.set(cmdId, filePath)
              }
            }
          }
        }
        
        // Scan the commands directory
        scanDir(commandsDir)
        this.log(`Found command files: ${[...commandFiles.keys()].join(', ')}`)

        // Manually load command classes from files
        for (const id of commandFiles.keys()) {
          try {
            // Try to load via oclif first, which will handle dependencies properly
            const CommandClass = config.findCommand(id)
            if (CommandClass) {
              this.commands.set(id, CommandClass)
              this.log(`Loaded command via oclif: ${id}`)
            } else {
              this.log(`Could not load via oclif, command ID may differ: ${id}`)
            }
          } catch (error) {
            this.log(`Error loading command ${id}: ${error}`)
          }
        }
      } else {
        this.log(`Commands directory not found: ${commandsDir}`)
      }
      
      // Always load built-in commands
      this.log('Loading built-in commands')
      
      // Log available command IDs to debug
      this.log('Available command IDs:')
      const allCommands = config.commandIDs
      this.log(allCommands.join(', '))

      // Load built-in commands
      for (const id of allCommands) {
        if (id !== 'mcp' && !this.commands.has(id)) { // Skip the MCP command and already loaded commands
          try {
            const CommandClass = config.findCommand(id)
            if (CommandClass) {
              this.commands.set(id, CommandClass)
              this.log(`Loaded command: ${id}`)
            }
          } catch (error) {
            this.log(`Error loading command ${id}: ${error}`)
          }
        }
      }
    } catch (error) {
      this.log(`Error loading commands: ${error}`)
    }
  }

  private async runCommand(id: string, args: Record<string, unknown>): Promise<{error?: string; output?: string;}> {
    const Command = this.commands.get(id)
    if (!Command) {
      return { error: `Command ${id} not found` }
    }

    // Create a new instance of the command
    const instance = new (Command as any)([], this.config)
    
    try {
      // Prepare argv-style arguments for oclif parsing
      const argv: string[] = []
      
      // Add any positional arguments
      if ((Command as any).args) {
        for (const [name] of Object.entries((Command as any).args)) {
          if (args[name]) {
            argv.push(String(args[name]))
          }
        }
      }

      // Add any flags
      if ((Command as any).flags) {
        for (const [name, flag] of Object.entries((Command as any).flags)) {
          if (args[name] !== undefined) {
            if ((flag as any).type === 'boolean') {
              if (args[name]) {
                argv.push(`--${name}`)
              }
            } else {
              argv.push(`--${name}=${args[name]}`)
            }
          }
        }
      }

      // Capture the output
      let output = ''
      const originalLog = instance.log.bind(instance)
      instance.log = (...args: unknown[]): void => {
        output += args.join(' ') + '\n'
        originalLog(...args)
      }

      // Run the command
      await instance.run(argv)
      
      return { output }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      return { error: errorMessage }
    }
  }

  private setupMCPServer(port: number): void {
    const app = express()
    app.use(cors())
    app.use(bodyParser.json())

    // MCP protocol endpoints
    app.post('/list-tools', (_req: Request, res: Response) => {
      const tools = this.getToolSchemas()
      // Return the tools in the expected format
      res.json({ tools })
    })

    app.post('/call-tool', async (req: Request, res: Response) => {
      const { arguments: args, name } = req.body
      
      if (!name || !args) {
        return res.status(400).json({ error: 'Invalid request format' })
      }

      try {
        const result = await this.runCommand(name, args)
        if (result.error) {
          return res.json({ error: result.error })
        }
        
        res.json({ content: result.output })
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        res.status(500).json({ error: errorMessage })
      }
    })

    app.post('/close', (_req: Request, res: Response) => {
      res.json({ success: true })
      // This is a CLI app, so process.exit is allowed here
      setTimeout(() => process.exit(0), 100)
    })

    // Add a root endpoint that shows available endpoints
    app.get('/', (_req: Request, res: Response) => {
      res.json({
        availableTools: [...this.commands.keys()],
        endpoints: [
          { description: 'List all available tools', method: 'POST', path: '/list-tools' },
          { description: 'Call a specific tool', method: 'POST', path: '/call-tool' },
          { description: 'Shut down the server', method: 'POST', path: '/close' },
        ],
      })
    })

    app.listen(port, () => {
      this.log(`MCP server running on port ${port}`)
      this.log(`Available tools: ${[...this.commands.keys()].join(', ')}`)
      this.log('Use Ctrl+C to stop the server')
    })
  }
}

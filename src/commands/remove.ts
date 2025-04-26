import {Args, Command, Flags} from '@oclif/core'
import {execSync} from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import ora from 'ora'

export default class Remove extends Command {
  static override args = {
    session: Args.string({description: 'Name of the session to remove'}),
  }
  static override description = 'Remove a vibegit session or all sessions'
  static override examples = [
    '<%= config.bin %> <%= command.id %> experiment-feature',
    '<%= config.bin %> <%= command.id %> --all',
  ]
  static override flags = {
    all: Flags.boolean({description: 'Remove all sessions'}),
    force: Flags.boolean({char: 'f', description: 'Skip confirmation prompt'}),
    push: Flags.boolean({description: 'Push the repository before removing the session'}),
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(Remove)
    const {session} = args
    const {all, force, push} = flags

    // Validate arguments
    if (!session && !all) {
      this.error('Error: Please specify a session name or use --all to remove all sessions')
    }

    if (session && all) {
      this.error('Error: Cannot specify both a session name and --all flag')
    }

    // Start spinner
    const spinner = ora('Finding vibegit sessions...').start()

    try {
      // Get the current repo path and name
      const repoPath = this.getRepoPath()
      const repoName = path.basename(repoPath)
      const parentDir = path.dirname(repoPath)
      
      // Pattern for matching session directories
      const sessionPattern = new RegExp(`^${repoName}-(.+)$`)
      
      // Find all potential session directories
      const allDirs = fs.readdirSync(parentDir, {withFileTypes: true})
        .filter(dirent => dirent.isDirectory())
        .filter(dirent => sessionPattern.test(dirent.name))
        .map(dirent => {
          const match = dirent.name.match(sessionPattern)
          return {
            dirName: dirent.name,
            fullPath: path.join(parentDir, dirent.name),
            sessionName: match ? match[1] : '',
          }
        })

      if (allDirs.length === 0) {
        spinner.fail('No vibegit sessions found')
        return
      }

      // Determine which sessions to remove
      let sessionsToRemove = []
      
      if (all) {
        sessionsToRemove = allDirs
        spinner.text = `Found ${sessionsToRemove.length} sessions to remove`
      } else {
        // Find the specific session
        const sessionDir = allDirs.find(dir => dir.sessionName === session)
        
        if (!sessionDir) {
          spinner.fail(`Session "${session}" not found`)
          return
        }
        
        sessionsToRemove = [sessionDir]
        spinner.text = `Found session "${session}" at ${sessionDir.fullPath}`
      }

      // Push the repo if requested
      if (push) {
        const canContinue = await this.handlePushRepository(repoPath, spinner, force)
        if (!canContinue) return
      }

      // Confirm with user unless force flag is set
      if (!force) {
        spinner.stop()
        
        const sessionPaths = sessionsToRemove.map(s => s.fullPath).join('\n  - ')
        const confirmed = await this.confirm(
          `Are you sure you want to remove ${sessionsToRemove.length === 1 ? 'this session' : 'these sessions'}?\n  - ${sessionPaths}\n`
        )
        
        if (!confirmed) {
          this.log('Operation cancelled')
          return
        }
        
        spinner.start('Removing sessions...')
      }

      // Remove the session(s)
      for (const sessionDir of sessionsToRemove) {
        spinner.text = `Removing ${sessionDir.dirName}...`
        fs.rmSync(sessionDir.fullPath, {force: true, recursive: true})
      }

      spinner.succeed(`Successfully removed ${sessionsToRemove.length} session${sessionsToRemove.length === 1 ? '' : 's'}`)
    } catch (error) {
      spinner.fail(`Failed to remove session(s): ${error instanceof Error ? error.message : String(error)}`)
      throw error
    }
  }

  private async confirm(message: string): Promise<boolean> {
     
    process.stdout.write(`${message}(y/N) `)
    
    return new Promise(resolve => {
      const listener = (data: Buffer) => {
        const input = data.toString().trim().toLowerCase()
        process.stdin.removeListener('data', listener)
        process.stdin.setRawMode(false)
        process.stdin.pause()
         
        console.log() // Add a newline after the response
        resolve(input === 'y' || input === 'yes')
      }
      
      process.stdin.setRawMode(true)
      process.stdin.resume()
      process.stdin.once('data', listener)
    })
  }

  private getRepoPath(): string {
    try {
      return execSync('git rev-parse --show-toplevel', {encoding: 'utf8'}).trim()
    } catch {
      this.error('Error: Not in a Git repository. Please run this command from inside a Git repository.')
    }
  }

  private async handlePushRepository(repoPath: string, spinner: ReturnType<typeof ora>, force: boolean): Promise<boolean> {
    try {
      spinner.text = 'Pushing repository to remote...'
      execSync('git push', {cwd: repoPath, stdio: 'pipe'})
      spinner.succeed('Repository pushed successfully')
      spinner.start('Continuing with session removal...')
      return true
    } catch (error) {
      spinner.warn(`Failed to push repository: ${error instanceof Error ? error.message : String(error)}`)
      
      if (force) return true
      
      spinner.stop()
      const confirmed = await this.confirm('Push failed. Continue with session removal anyway?')
      if (!confirmed) {
        this.log('Operation cancelled')
        return false
      }
      
      spinner.start('Continuing with session removal...')
      return true
    }
  }
}

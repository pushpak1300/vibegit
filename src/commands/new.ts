import {Args, Command, Flags} from '@oclif/core'
import {execSync} from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import ora from 'ora'

export default class New extends Command {
  static override args = {
    session: Args.string({description: 'Name of the session/branch', required: true}),
  }
  static override description = 'Create a new sandbox environment from the current repo'
  static override examples = [
    '<%= config.bin %> <%= command.id %> experiment-feature',
    '<%= config.bin %> <%= command.id %> bugfix-123 --include-dirty',
    '<%= config.bin %> <%= command.id %> new-idea',
  ]
  static override flags = {
    force: Flags.boolean({char: 'f', description: 'Skip checks and force creation if target directory exists'}),
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(New)
    const {session} = args

    // Start spinner
    const spinner = ora('Setting up your vibegit session...').start()

    try {
      // Step 1: Pre-flight checks
      spinner.text = 'Running pre-flight checks...'
      if (!this.isGitRepo()) {
        spinner.fail('Not in a Git repository')
        this.error('Please run this command from inside a Git repository.')
      }

      // Step 2: Determine source and target paths
      spinner.text = 'Determining paths...'
      const repoPath = this.getRepoPath()
      const repoName = path.basename(repoPath)
      const targetPath = path.resolve(path.join('..', `${repoName}-${session}`))

      if (fs.existsSync(targetPath)) {
        if (!flags.force) {
          spinner.fail(`Target directory "${targetPath}" already exists`)
          this.error('Use --force to override.')
        }
        
        // Remove existing directory if force flag is set
        spinner.text = `Removing existing directory at ${targetPath}...`
        fs.rmSync(targetPath, {force: true, recursive: true})
      }

      // Step 3: Copy the entire directory
      spinner.text = `Creating new session "${session}" at ${targetPath}...`
      this.copyDirectory(repoPath, targetPath, (progress) => {
        spinner.text = `Copying files: ${progress}`
      })

      // Step 4: Create and checkout a new branch with the session name
      spinner.text = `Creating branch "${session}" in the new directory...`
      try {
        execSync(`git checkout -b "${session}"`, {cwd: targetPath, stdio: 'ignore'})
      } catch (error) {
        spinner.warn(`Failed to create branch: ${error instanceof Error ? error.message : String(error)}`)
      }

      // Complete
      spinner.succeed('Session created successfully!')
      
      // Print success details
      this.log(`📁 Path: ${targetPath}`)
      this.log(`🌿 Branch: ${session}`)
      this.log(`🚀 Next step: cd "${targetPath}" and start coding!`)
    } catch (error) {
      spinner.fail(`Failed to create session: ${error instanceof Error ? error.message : String(error)}`)
      throw error
    }
  }

  private copyDirectory(source: string, target: string, progressCallback?: (status: string) => void): void {
    // Create the target directory
    fs.mkdirSync(target, {recursive: true})
    
    // Read all entries in the source directory, including hidden files
    const entries = fs.readdirSync(source, {withFileTypes: true})
    let processedCount = 0
    const totalCount = entries.length
    
    for (const entry of entries) {
      const srcPath = path.join(source, entry.name)
      const destPath = path.join(target, entry.name)
      
      if (entry.isDirectory()) {
        // Recursively copy directories
        this.copyDirectory(srcPath, destPath)
      } else {
        // Copy files
        fs.copyFileSync(srcPath, destPath)
      }
      
      processedCount++
      if (progressCallback) {
        progressCallback(`${processedCount}/${totalCount} items`)
      }
    }
  }
  
  private getRepoPath(): string {
    return this.runCommand('git rev-parse --show-toplevel')
  }

  private isGitRepo(): boolean {
    try {
      execSync('git rev-parse --is-inside-work-tree', {stdio: 'ignore'})
      return true
    } catch {
      return false
    }
  }

  private runCommand(command: string): string {
    try {
      return execSync(command, {encoding: 'utf8'}).trim()
    } catch (error: unknown) {
      if (error instanceof Error) {
        return error.message
      }
      
      return String(error)
    }
  }
}

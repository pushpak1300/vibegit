import {Command, Flags} from '@oclif/core'
import {execSync} from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import ora from 'ora'

export default class List extends Command {
  static override description = 'List all vibegit sessions'
  static override examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --verbose',
  ]
  static override flags = {
    verbose: Flags.boolean({char: 'v', description: 'Show additional details for each session'}),
  }

  public async run(): Promise<void> {
    const {flags} = await this.parse(List)
    const {verbose} = flags

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
      const sessions = fs.readdirSync(parentDir, {withFileTypes: true})
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

      spinner.stop()

      if (sessions.length === 0) {
        this.log('No vibegit sessions found')
        return
      }

      this.log(`Found ${sessions.length} vibegit session${sessions.length === 1 ? '' : 's'}:\n`)
      
      for (const session of sessions) {
        if (verbose) {
          this.log(`• ${session.sessionName}`)
          this.log(`  Path: ${session.fullPath}`)
          try {
            // Get the current branch of the session
            const branch = execSync('git branch --show-current', {
              cwd: session.fullPath,
              encoding: 'utf8',
              stdio: ['ignore', 'pipe', 'ignore'],
            }).trim()
            this.log(`  Branch: ${branch || 'Unknown'}`)
            
            // Get the last commit date
            const lastCommit = execSync('git log -1 --format=%cd --date=relative', {
              cwd: session.fullPath,
              encoding: 'utf8',
              stdio: ['ignore', 'pipe', 'ignore'],
            }).trim()
            this.log(`  Last commit: ${lastCommit || 'No commits'}`)
            this.log('')
          } catch {
            this.log(`  Git info: Unavailable`)
            this.log('')
          }
        } else {
          this.log(`• ${session.sessionName} (${session.fullPath})`)
        }
      }
    } catch (error) {
      spinner.fail(`Failed to list sessions: ${error instanceof Error ? error.message : String(error)}`)
      throw error
    }
  }

  private getRepoPath(): string {
    try {
      return execSync('git rev-parse --show-toplevel', {encoding: 'utf8'}).trim()
    } catch {
      this.error('Error: Not in a Git repository. Please run this command from inside a Git repository.')
    }
  }
}

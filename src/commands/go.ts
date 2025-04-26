import {Args, Command, Flags} from '@oclif/core'
import {execSync} from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import ora from 'ora'

export default class Go extends Command {
  static override args = {
    session: Args.string({description: 'Name of the session to go to', required: true}),
  }
  static override description = 'Output command to navigate to a vibegit session directory'
  static override examples = [
    '<%= config.bin %> <%= command.id %> feature-branch',
    'eval "$(<%= config.bin %> <%= command.id %> feature-branch)"',
  ]
  static override flags = {
    'no-hint': Flags.boolean({description: 'Suppress usage hints'}),
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(Go)
    const {session} = args
    const showHints = !flags['no-hint']

    // Start spinner
    const spinner = ora('Finding vibegit session...').start()

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
        this.error('No vibegit sessions found')
        return
      }

      // Find the specific session
      const sessionDir = sessions.find(s => s.sessionName === session)
      
      if (!sessionDir) {
        this.error(`Session "${session}" not found`)
        return
      }

      // Show only the cd command without any extra text
      // This makes it suitable for shell evaluation
      process.stdout.write(`cd "${sessionDir.fullPath}"\n`)
      
      // Show a note about usage in stderr (won't be captured by eval)
      if (showHints) {
        process.stderr.write(`\nTip: To navigate directly, use: eval "$(vibegit go ${session})"\n`)
        process.stderr.write(`Add this to your shell profile for convenience:\n`)
        process.stderr.write(`function vg() { eval "$(vibegit go $1)"; }\n`)
      }
    } catch (error) {
      spinner.fail(`Failed: ${error instanceof Error ? error.message : String(error)}`)
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

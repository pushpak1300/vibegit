import {Args, Command} from '@oclif/core'
import {execSync} from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import ora from 'ora'

export default class Go extends Command {
  static override args = {
    session: Args.string({description: 'Name of the session to go to', required: true}),
  }
  static override description = 'Show path to a vibegit session directory'
  static override examples = [
    '<%= config.bin %> <%= command.id %> feature-branch',
  ]

  public async run(): Promise<void> {
    const {args} = await this.parse(Go)
    const {session} = args

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
        this.log('No vibegit sessions found')
        return
      }

      // Find the specific session
      const sessionDir = sessions.find(s => s.sessionName === session)
      
      if (!sessionDir) {
        this.error(`Session "${session}" not found`)
        return
      }

      // Show the path to the session
      this.log(`cd "${sessionDir.fullPath}"`)
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

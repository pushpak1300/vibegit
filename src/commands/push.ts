import {Args, Command, Flags} from '@oclif/core'
import {execSync} from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import ora from 'ora'

export default class Push extends Command {
  static override args = {
    session: Args.string({description: 'Name of the session to push', required: false}),
  }
  static override description = 'Push code changes to remote repository'
  static override examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --all',
    '<%= config.bin %> <%= command.id %> experiment-feature',
  ]
  static override flags = {
    all: Flags.boolean({description: 'Push all sessions to their respective branches'}),
    force: Flags.boolean({char: 'f', description: 'Force push (git push -f)'}),
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(Push)
    const {session} = args
    const {all, force} = flags

    // Start spinner
    const spinner = ora('Preparing to push...').start()

    try {
      // Validate arguments
      if (!session && !all) {
        // If no session specified and --all not provided, push current repository
        spinner.text = 'Pushing current repository...'
        this.pushRepository(process.cwd(), spinner, force)
        spinner.succeed('Current repository pushed successfully')
        return
      }

      if (session && all) {
        spinner.fail('Cannot specify both a session name and --all flag')
        this.error('Please either specify a session name or use --all, not both')
      }

      // Get the current repo path and name
      const repoPath = this.getRepoPath()
      const repoName = path.basename(repoPath)
      const parentDir = path.dirname(repoPath)
      
      // Pattern for matching session directories
      const sessionPattern = new RegExp(`^${repoName}-(.+)$`)
      
      // Find all potential session directories
      const allSessions = fs.readdirSync(parentDir, {withFileTypes: true})
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

      if (allSessions.length === 0) {
        spinner.fail('No vibegit sessions found')
        return
      }

      // Determine which sessions to push
      let sessionsToPush = []
      
      if (all) {
        sessionsToPush = allSessions
        spinner.text = `Found ${sessionsToPush.length} sessions to push`
      } else {
        // Find the specific session
        const sessionDir = allSessions.find(dir => dir.sessionName === session)
        
        if (!sessionDir) {
          spinner.fail(`Session "${session}" not found`)
          return
        }
        
        sessionsToPush = [sessionDir]
        spinner.text = `Found session "${session}" at ${sessionDir.fullPath}`
      }

      // Push each session
      let successCount = 0
      let failCount = 0

      for (const sessionDir of sessionsToPush) {
        spinner.text = `Pushing ${sessionDir.sessionName}...`
        try {
          this.pushRepository(sessionDir.fullPath, spinner, force)
          successCount++
        } catch (error) {
          failCount++
          spinner.warn(`Failed to push session "${sessionDir.sessionName}": ${error instanceof Error ? error.message : String(error)}`)
        }
      }

      if (failCount === 0) {
        spinner.succeed(`Successfully pushed ${successCount} session${successCount === 1 ? '' : 's'}`)
      } else {
        spinner.warn(`Pushed ${successCount} session${successCount === 1 ? '' : 's'}, failed to push ${failCount}`)
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

  private pushRepository(repoPath: string, spinner: ReturnType<typeof ora>, force: boolean): void {
    try {
      const command = force ? 'git push -f' : 'git push'
      execSync(command, {cwd: repoPath, stdio: 'pipe'})
    } catch (error) {
      throw new Error(`Git push failed: ${error instanceof Error ? error.message : String(error)}`)
    }
  }
}

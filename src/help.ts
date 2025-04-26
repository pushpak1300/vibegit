import {Command, Help, ux} from '@oclif/core'

export default class RootHelp extends Help {
  formatRoot(): string {
    return this.logo()
  }

  public async showCommandHelp(command: Command.Loadable): Promise<void> {
    this.log(this.logo())
    await super.showCommandHelp(command)
  }

  private logo(): string {
    return ux.colorize(
      'green',
      `
▗▖  ▗▖▗▄▄▄▖▗▄▄▖ ▗▄▄▄▖ ▗▄▄▖▗▄▄▄▖▗▄▄▄▖
▐▌  ▐▌  █  ▐▌ ▐▌▐▌   ▐▌     █    █  
▐▌  ▐▌  █  ▐▛▀▚▖▐▛▀▀▘▐▌▝▜▌  █    █  
 ▝▚▞▘ ▗▄█▄▖▐▙▄▞▘▐▙▄▄▖▝▚▄▞▘▗▄█▄▖  █                                  
`,
    )
  }
}

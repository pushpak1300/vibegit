import {Help, ux} from '@oclif/core'

export default class RootHelp extends Help {
  formatRoot(): string {
    return ux.colorize('green',`
▗▖  ▗▖▗▄▄▄▖▗▄▄▖ ▗▄▄▄▖ ▗▄▄▖▗▄▄▄▖▗▄▄▄▖
▐▌  ▐▌  █  ▐▌ ▐▌▐▌   ▐▌     █    █  
▐▌  ▐▌  █  ▐▛▀▚▖▐▛▀▀▘▐▌▝▜▌  █    █  
 ▝▚▞▘ ▗▄█▄▖▐▙▄▞▘▐▙▄▄▖▝▚▄▞▘▗▄█▄▖  █                                  
`);
  }
}

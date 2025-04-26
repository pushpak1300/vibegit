import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('mcp', () => {
  it('runs mcp cmd', async () => {
    const {stdout} = await runCommand('mcp')
    expect(stdout).to.contain('hello world')
  })

  it('runs mcp --name oclif', async () => {
    const {stdout} = await runCommand('mcp --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})

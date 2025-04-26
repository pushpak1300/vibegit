import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('go', () => {
  it('runs go cmd', async () => {
    const {stdout} = await runCommand('go')
    expect(stdout).to.contain('hello world')
  })

  it('runs go --name oclif', async () => {
    const {stdout} = await runCommand('go --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})

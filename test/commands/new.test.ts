import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('new', () => {
  it('runs new cmd', async () => {
    const {stdout} = await runCommand('new')
    expect(stdout).to.contain('hello world')
  })

  it('runs new --name oclif', async () => {
    const {stdout} = await runCommand('new --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})

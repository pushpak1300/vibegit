import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('remove', () => {
  it('runs remove cmd', async () => {
    const {stdout} = await runCommand('remove')
    expect(stdout).to.contain('hello world')
  })

  it('runs remove --name oclif', async () => {
    const {stdout} = await runCommand('remove --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})

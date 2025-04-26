import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('push', () => {
  it('runs push cmd', async () => {
    const {stdout} = await runCommand('push')
    expect(stdout).to.contain('hello world')
  })

  it('runs push --name oclif', async () => {
    const {stdout} = await runCommand('push --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})

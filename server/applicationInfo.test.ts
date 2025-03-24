import applicationInfo from './applicationInfo'

describe('Application Info', () => {
  it('test applicationInfo', () => {
    expect(applicationInfo()).toEqual({
      applicationName: 'hmpps-resettlement-passport-ui',
      branchName: 'xxxxxxxxxxxxxxxxxxx',
      buildNumber: '1_0_0',
      gitRef: 'xxxxxxxxxxxxxxxxxxx',
      gitShortHash: 'xxxxxxx',
      productId: 'UNASSIGNED',
    })
  })
})

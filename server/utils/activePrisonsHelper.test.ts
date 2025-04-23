import { addActivePrisons } from './activePrisonsHelper'
import Config from '../s3Config'
import { ApplicationInfo } from '../applicationInfo'
import { ConfigFile } from '../@types/express'

jest.mock('../s3Config', () => ({
  Config: {
    getInstance: jest.fn(),
  },
}))

describe('addActivePrisons', () => {
  const mockConfig = {
    getConfig: jest.fn<Promise<ConfigFile>, []>(),
  }

  beforeEach(() => {
    Config.getInstance = jest.fn().mockReturnValue(mockConfig)
  })

  it('should add activePrisons from config', async () => {
    mockConfig.getConfig.mockResolvedValue({
      reports: undefined,
      supportNeeds: undefined,
      whatsNew: undefined,
      activePrisons: ['A', 'B', 'C'],
    })

    const originalApplicationInfo: ApplicationInfo = {
      branchName: '',
      buildNumber: '',
      gitRef: '',
      gitShortHash: '',
      productId: '',
      applicationName: 'test-app',
      additionalFields: {},
    }

    const result = addActivePrisons(originalApplicationInfo)

    // Wait for promises to resolve (even though function isn't async)
    await new Promise(process.nextTick)

    expect(result.additionalFields).toEqual({
      activeAgencies: ['A', 'B', 'C'],
    })
  })

  it('should default to ["***"] when config retrieval fails', async () => {
    // Mock getConfig to reject with an error
    mockConfig.getConfig.mockRejectedValue(new Error('Config error'))

    const originalApplicationInfo: ApplicationInfo = {
      branchName: '',
      buildNumber: '',
      gitRef: '',
      gitShortHash: '',
      productId: '',
      applicationName: 'test-app',
      additionalFields: {},
    }

    const result = addActivePrisons(originalApplicationInfo)

    await new Promise(process.nextTick)

    expect(result.additionalFields).toEqual({
      activeAgencies: [],
    })
  })
})

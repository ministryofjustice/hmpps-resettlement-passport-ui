import { readFile } from 'node:fs/promises'
import FeatureFlags from './featureFlag'

jest.mock('node:fs/promises', () => ({
  readFile: jest.fn(),
}))

jest.mock('./config', () => ({
  s3: {
    featureFlag: {
      enabled: false,
    },
  },
  local: {
    featureFlag: {
      enabled: true,
    },
  },
}))

describe('FeatureFlag', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  afterEach(() => {
    jest.clearAllMocks()
    FeatureFlags.resetInstance()
  })

  describe('getInstance', () => {
    it('should return the same instance on multiple calls', () => {
      const instance1 = FeatureFlags.getInstance()
      const instance2 = FeatureFlags.getInstance()
      expect(instance1).toBe(instance2)
    })
  })

  describe('initialize', () => {
    it('IsInitialized should return false', () => {
      const ff = FeatureFlags.getInstance()
      expect(ff.IsInitialized()).toEqual(false)
    })

    it('initialize with featureFlags turned off', async () => {
      jest.doMock('./config', () => ({
        s3: {
          featureFlag: {
            enabled: false,
          },
        },
        local: {
          featureFlag: {
            enabled: false,
          },
        },
      }))
      // Needed here to override the config in FeatureFlags
      // eslint-disable-next-line @typescript-eslint/no-var-requires,global-require
      const FeatureFlagsDefault = require('./featureFlag').default
      const ff = FeatureFlagsDefault.getInstance()
      await ff.initialize()
      expect(ff.IsInitialized()).toEqual(true)
      const featureFlagsMap = Reflect.get(ff, 'featureFlags')
      expect(featureFlagsMap).toEqual(new Map())
    })

    it('initialize local feature flags', async () => {
      ;(readFile as jest.Mock).mockResolvedValue(
        '[{"feature":"flag1", "enabled":true}, {"feature":"flag2", "enabled":false}]',
      )
      const ff = FeatureFlags.getInstance()
      await ff.initialize()
      expect(ff.IsInitialized()).toEqual(true)
      const featureFlagsMap = Reflect.get(ff, 'featureFlags')
      const expectedMap = new Map<string, boolean>([
        ['flag1', true],
        ['flag2', false],
      ])
      expect(featureFlagsMap).toEqual(expectedMap)
    })
  })

  describe('getFeatureFlag', () => {
    it('getFeatureFlag happy path', async () => {
      ;(readFile as jest.Mock).mockResolvedValue(
        '[{"feature":"flag1", "enabled":true}, {"feature":"flag2", "enabled":false}]',
      )
      const ff = FeatureFlags.getInstance()
      await ff.initialize()
      expect(ff.getFeatureFlag('flag1')).toEqual(true)
      expect(ff.getFeatureFlag('flag2')).toEqual(false)
    })

    it('getFeatureFlag not initialized', () => {
      ;(readFile as jest.Mock).mockResolvedValue(
        '[{"feature":"flag1", "enabled":true}, {"feature":"flag2", "enabled":false}]',
      )
      const ff = FeatureFlags.getInstance()
      expect(() => ff.getFeatureFlag('flag1')).toThrow('FeatureFlags not available')
    })

    it('getFeatureFlag no flag', async () => {
      ;(readFile as jest.Mock).mockResolvedValue(
        '[{"feature":"flag1", "enabled":true}, {"feature":"flag2", "enabled":false}]',
      )
      const ff = FeatureFlags.getInstance()
      await ff.initialize()
      expect(() => ff.getFeatureFlag('flag5')).toThrow('Feature "flag5" does not exist.')
    })
  })
})

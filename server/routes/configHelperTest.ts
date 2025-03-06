import Config from '../s3Config'
import { ConfigFile } from '../@types/express'

export const defaultTestConfig: ConfigFile = {
  reports: {
    immediateNeedsVersion: {
      ACCOMMODATION: 2,
      ATTITUDES_THINKING_AND_BEHAVIOUR: 1,
      CHILDREN_FAMILIES_AND_COMMUNITY: 1,
      DRUGS_AND_ALCOHOL: 1,
      EDUCATION_SKILLS_AND_WORK: 1,
      FINANCE_AND_ID: 1,
      HEALTH: 1,
    },
    preReleaseVersion: {
      ACCOMMODATION: 2,
      ATTITUDES_THINKING_AND_BEHAVIOUR: 1,
      CHILDREN_FAMILIES_AND_COMMUNITY: 1,
      DRUGS_AND_ALCOHOL: 1,
      EDUCATION_SKILLS_AND_WORK: 1,
      FINANCE_AND_ID: 1,
      HEALTH: 1,
    },
  },
  whatsNew: {
    enabled: false,
    version: '1',
  },
  supportNeeds: {
    releaseDate: '2025-03-18',
  },
}

export function configHelper(config: jest.Mocked<Config>, getConfigReturnValue: ConfigFile = defaultTestConfig) {
  const mockStaticConfig = jest.fn().mockReturnValue(config)
  Config.getInstance = mockStaticConfig
  jest.spyOn(config, 'getConfig').mockResolvedValue(getConfigReturnValue)
}

import Config from '../s3Config'

export function configHelper(config: jest.Mocked<Config>, showDeclaration: boolean = false) {
  const mockStaticConfig = jest.fn().mockReturnValue(config)
  Config.getInstance = mockStaticConfig
  jest.spyOn(config, 'getConfig').mockResolvedValue({
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
      showDeclaration,
    },
  })
}

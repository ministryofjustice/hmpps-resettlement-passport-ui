import { responseHeaders } from '../headers'
import { stubFor } from '../wiremock'

const prisonersSearchWithWatchlist = () =>
  stubFor({
    name: 'watchList filter response',
    request: {
      urlPathPattern: '/rpApi/resettlement-passport/prison/1/prisoners',
      method: 'GET',
    },
    response: {
      status: 200,
      headers: responseHeaders,
      jsonBody: {
        content: [
          //   {
          //     prisonerNumber: 'A8731DY',
          //     firstName: 'JOHN',
          //     middleNames: 'MICHAEL',
          //     lastName: 'SMITH',
          //     releaseDate: '2024-06-17',
          //     releaseType: 'CRD',
          //     lastUpdatedDate: '2024-04-02',
          //     status: [
          //       {
          //         pathway: 'ACCOMMODATION',
          //         status: 'IN_PROGRESS',
          //         lastDateChange: '2024-05-29',
          //       },
          //       {
          //         pathway: 'ATTITUDES_THINKING_AND_BEHAVIOUR',
          //         status: 'SUPPORT_REQUIRED',
          //         lastDateChange: '2024-05-29',
          //       },
          //       {
          //         pathway: 'CHILDREN_FAMILIES_AND_COMMUNITY',
          //         status: 'SUPPORT_DECLINED',
          //         lastDateChange: '2024-05-29',
          //       },
          //       {
          //         pathway: 'DRUGS_AND_ALCOHOL',
          //         status: 'SUPPORT_NOT_REQUIRED',
          //         lastDateChange: '2024-04-02',
          //       },
          //       {
          //         pathway: 'EDUCATION_SKILLS_AND_WORK',
          //         status: 'IN_PROGRESS',
          //         lastDateChange: '2024-04-19',
          //       },
          //       {
          //         pathway: 'FINANCE_AND_ID',
          //         status: 'NOT_STARTED',
          //         lastDateChange: '2024-05-29',
          //       },
          //       {
          //         pathway: 'HEALTH',
          //         status: 'SUPPORT_NOT_REQUIRED',
          //         lastDateChange: '2024-04-19',
          //       },
          //     ],
          //     pathwayStatus: null,
          //     homeDetentionCurfewEligibilityDate: '2017-01-01',
          //     paroleEligibilityDate: null,
          //     releaseEligibilityDate: '2017-01-01',
          //     releaseEligibilityType: 'HDCED',
          //     releaseOnTemporaryLicenceDate: null,
          //     assessmentRequired: true,
          //   },
          {
            prisonerNumber: 'G4161UF',
            firstName: 'CHRISY',
            middleNames: null,
            lastName: 'CLEMENCE',
            releaseDate: '2024-08-01',
            releaseType: 'CRD',
            lastUpdatedDate: '2024-05-08',
            status: [
              {
                pathway: 'ACCOMMODATION',
                status: 'SUPPORT_DECLINED',
                lastDateChange: '2024-05-08',
              },
              {
                pathway: 'ATTITUDES_THINKING_AND_BEHAVIOUR',
                status: 'SUPPORT_NOT_REQUIRED',
                lastDateChange: '2024-05-08',
              },
              {
                pathway: 'CHILDREN_FAMILIES_AND_COMMUNITY',
                status: 'SUPPORT_REQUIRED',
                lastDateChange: '2024-05-08',
              },
              {
                pathway: 'DRUGS_AND_ALCOHOL',
                status: 'SUPPORT_REQUIRED',
                lastDateChange: '2024-05-08',
              },
              {
                pathway: 'EDUCATION_SKILLS_AND_WORK',
                status: 'SUPPORT_REQUIRED',
                lastDateChange: '2024-05-08',
              },
              {
                pathway: 'FINANCE_AND_ID',
                status: 'SUPPORT_DECLINED',
                lastDateChange: '2024-05-08',
              },
              {
                pathway: 'HEALTH',
                status: 'SUPPORT_REQUIRED',
                lastDateChange: '2024-05-08',
              },
            ],
            pathwayStatus: null,
            homeDetentionCurfewEligibilityDate: null,
            paroleEligibilityDate: null,
            releaseEligibilityDate: null,
            releaseEligibilityType: null,
            releaseOnTemporaryLicenceDate: null,
            assessmentRequired: true,
          },
        ],
        pageSize: 2,
        page: 0,
        sortName: 'releaseDate,ASC',
        totalElements: 2,
        last: true,
      },
    },
  })

export default prisonersSearchWithWatchlist

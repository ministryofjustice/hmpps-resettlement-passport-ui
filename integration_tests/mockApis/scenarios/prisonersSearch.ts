import { responseHeaders } from '../headers'
import { stubFor } from '../wiremock'

const chrisyClemenceSearchResponse = {
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
}

const johnSmithSearchResponse = {
  prisonerNumber: 'A8731DY',
  firstName: 'JOHN',
  middleNames: null,
  lastName: 'SMITH',
  releaseDate: '2024-08-05',
  releaseType: 'CRD',
  lastUpdatedDate: '2024-05-01',
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
}

export const prisonersSearchBeforeWatchlist = () =>
  stubFor({
    name: 'search response',
    request: {
      urlPathPattern: '/rpApi/resettlement-passport/prison/1/prisoners',
      method: 'GET',
      queryParameters: {
        watchList: {
          equalTo: '',
        },
      },
    },
    response: {
      status: 200,
      headers: responseHeaders,
      jsonBody: {
        content: [chrisyClemenceSearchResponse, johnSmithSearchResponse],
        pageSize: 1,
        page: 0,
        sortName: 'releaseDate,ASC',
        totalElements: 1,
        last: true,
      },
    },
  })

export const prisonersSearchWithWatchlist = () =>
  stubFor({
    name: 'watchList filter response',
    request: {
      urlPathPattern: '/rpApi/resettlement-passport/prison/1/prisoners',
      method: 'GET',
      queryParameters: {
        watchList: {
          equalTo: 'true',
        },
      },
    },
    response: {
      status: 200,
      headers: responseHeaders,
      jsonBody: {
        content: [chrisyClemenceSearchResponse],
        pageSize: 1,
        page: 0,
        sortName: 'releaseDate,ASC',
        totalElements: 1,
        last: true,
      },
    },
  })

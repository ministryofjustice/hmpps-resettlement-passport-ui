import { PrisonerData } from '../../@types/express'

import RpService from '../../services/rpService'
import { PrisonersList } from '../../data/model/prisoners'

export function stubPrisonerDetails(rpService: RpService, releaseDate: string = null) {
  jest.spyOn(rpService, 'getPrisonerDetails').mockResolvedValue({
    personalDetails: {
      prisonerNumber: '123',
      facialImageId: '456',
      firstName: 'John',
      lastName: 'Smith',
      releaseDate,
    },
    pathways: [
      {
        pathway: 'ACCOMMODATION',
        status: 'IN_PROGRESS',
      },
    ],
  } as PrisonerData)
}

export function stubPrisonersList(rpService: RpService) {
  const prisonerList: PrisonersList = {
    content: [
      {
        prisonerNumber: 'G9808UX',
        firstName: 'CASEY',
        middleNames: 'AMARAWN',
        lastName: 'CHAVAN',
        releaseDate: '2024-11-30',
        releaseType: 'CRD',
        lastUpdatedDate: null,
        status: [
          {
            pathway: 'ACCOMMODATION',
            status: 'NOT_STARTED',
            lastDateChange: null,
          },
          {
            pathway: 'ATTITUDES_THINKING_AND_BEHAVIOUR',
            status: 'NOT_STARTED',
            lastDateChange: null,
          },
          {
            pathway: 'CHILDREN_FAMILIES_AND_COMMUNITY',
            status: 'NOT_STARTED',
            lastDateChange: null,
          },
          {
            pathway: 'DRUGS_AND_ALCOHOL',
            status: 'NOT_STARTED',
            lastDateChange: null,
          },
          {
            pathway: 'EDUCATION_SKILLS_AND_WORK',
            status: 'NOT_STARTED',
            lastDateChange: null,
          },
          {
            pathway: 'FINANCE_AND_ID',
            status: 'NOT_STARTED',
            lastDateChange: null,
          },
          {
            pathway: 'HEALTH',
            status: 'NOT_STARTED',
            lastDateChange: null,
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
    pageSize: 10,
    page: 0,
    sortName: 'releaseDate,ASC',
    totalElements: 92,
    last: false,
  }
  return jest.spyOn(rpService, 'getListOfPrisoners').mockResolvedValue(prisonerList)
}

export function sanitiseStackTrace(html: string) {
  return html.replaceAll(/at .*/g, 'at /')
}

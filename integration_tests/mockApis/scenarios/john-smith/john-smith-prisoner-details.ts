import { addMonths, format, addDays } from 'date-fns'
import { stubFor } from '../../wiremock'
import { responseHeaders } from '../../headers'

export const aDateOutsideOfPreReleaseWindow = format(addMonths(new Date(), 6), 'yyyy-MM-dd')
export const aDateInsideOfPreReleaseWindow = format(addDays(new Date(), 20), 'yyyy-MM-dd')

const statusFor = (pathway: string, pathwayStatus: Record<string, string>) => pathwayStatus[pathway] || 'NOT_STARTED'

type GetPrisonerArgs = {
  releaseDate?: string
  pathwayStatus?: Record<string, string>
  assessmentFlags?: {
    assessmentRequired: boolean
    resettlementReviewAvailable: boolean
    immediateNeedsSubmitted: boolean
    preReleaseSubmitted: boolean
  }
  scenarioName?: string
  requiredScenarioState?: string
}

export const stubJohnSmithPrisonerDetails = ({
  releaseDate = aDateOutsideOfPreReleaseWindow,
  pathwayStatus = {},
  assessmentFlags = {
    assessmentRequired: true,
    resettlementReviewAvailable: false,
    immediateNeedsSubmitted: false,
    preReleaseSubmitted: false,
  },
  scenarioName = null,
  requiredScenarioState = null,
}: GetPrisonerArgs) =>
  stubFor({
    name: 'John Smith Details',
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY',
      method: 'GET',
    },
    response: {
      headers: responseHeaders,
      status: 200,
      jsonBody: {
        personalDetails: {
          prisonerNumber: 'A8731DY',
          prisonId: 'MDI',
          firstName: 'John',
          middleNames: 'Michael',
          lastName: 'Smith',
          releaseDate,
          releaseType: 'CRD',
          dateOfBirth: '1982-10-24',
          age: 41,
          location: 'K-3-011',
          facialImageId: '1313058',
        },
        pathways: [
          {
            pathway: 'ACCOMMODATION',
            status: statusFor('ACCOMMODATION', pathwayStatus),
            lastDateChange: null,
          },
          {
            pathway: 'ATTITUDES_THINKING_AND_BEHAVIOUR',
            status: statusFor('ATTITUDES_THINKING_AND_BEHAVIOUR', pathwayStatus),
            lastDateChange: null,
          },
          {
            pathway: 'CHILDREN_FAMILIES_AND_COMMUNITY',
            status: statusFor('CHILDREN_FAMILIES_AND_COMMUNITY', pathwayStatus),
            lastDateChange: null,
          },
          {
            pathway: 'DRUGS_AND_ALCOHOL',
            status: statusFor('DRUGS_AND_ALCOHOL', pathwayStatus),
            lastDateChange: null,
          },
          {
            pathway: 'EDUCATION_SKILLS_AND_WORK',
            status: statusFor('EDUCATION_SKILLS_AND_WORK', pathwayStatus),
            lastDateChange: null,
          },
          {
            pathway: 'FINANCE_AND_ID',
            status: statusFor('FINANCE_AND_ID', pathwayStatus),
            lastDateChange: null,
          },
          {
            pathway: 'HEALTH',
            status: statusFor('HEALTH', pathwayStatus),
            lastDateChange: null,
          },
        ],
        ...assessmentFlags,
      },
    },
    scenarioName,
    requiredScenarioState,
  })

const johnSmithGetPrisonerDetails = (opts: GetPrisonerArgs = {}) => [stubJohnSmithPrisonerDetails(opts)]
export default johnSmithGetPrisonerDetails

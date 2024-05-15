import { addMonths, format, addDays } from 'date-fns'
import { stubFor } from '../../wiremock'
import { responseHeaders } from '../../headers'

export const aDateOutsideOfPreReleaseWindow = format(addMonths(new Date(), 6), 'yyyy-MM-dd')
export const aDateInsideOfPreReleaseWindow = format(addDays(new Date(), 20), 'yyyy-MM-dd')

const johnSmithPrisonerDetails = (releaseDate = aDateOutsideOfPreReleaseWindow) =>
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
          { pathway: 'FINANCE_AND_ID', status: 'NOT_STARTED', lastDateChange: null },
          {
            pathway: 'HEALTH',
            status: 'NOT_STARTED',
            lastDateChange: null,
          },
        ],
        assessmentRequired: true,
        resettlementReviewAvailable: false,
        immediateNeedsSubmitted: false,
        preReleaseSubmitted: false,
      },
    },
  })

const johnSmithGetPrisonerDetails = (releaseDate = aDateOutsideOfPreReleaseWindow) => [
  johnSmithPrisonerDetails(releaseDate),
]
export default johnSmithGetPrisonerDetails

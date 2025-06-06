import { stubFor } from '../../wiremock'

export const johnSmithResetProfile = () =>
  stubFor({
    name: 'resettlement-passport_prisoner_a8731dy_resettlement-assessment_accommodation_page_where_did_they_live',
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/reset-profile?supportNeedsEnabled=true',
      method: 'POST',
    },
    response: {
      status: 200,
    },
  })

export const johnSmithResetProfileLegacyCaseNotes = () =>
  stubFor({
    name: 'resettlement-passport_prisoner_a8731dy_resettlement-assessment_accommodation_page_where_did_they_live',
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/reset-profile?supportNeedsEnabled=false',
      method: 'POST',
    },
    response: {
      status: 200,
    },
  })

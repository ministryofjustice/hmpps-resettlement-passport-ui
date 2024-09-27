import { stubFor } from './wiremock'
import { submitHeaders } from './headers'
import { Pathway } from '../../server/@types/express'
import { AssessmentType } from '../../server/data/model/assessmentInformation'

export const validateAssessment = (pathway: Pathway, assessmentType: AssessmentType) => {
  return stubFor({
    request: {
      url: `/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/${pathway}/validate?assessmentType=${assessmentType}`,
      method: 'POST',
    },
    response: {
      status: 200,
      headers: submitHeaders,
    },
  })
}

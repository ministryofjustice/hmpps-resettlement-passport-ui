import {
  AssessmentPage,
  QuestionsAndAnswers,
  ValidationError,
  ValidationErrors,
} from '../data/model/immediateNeedsReport'

export type RequestBody = {
  [key: string]: string
}

const validateAssessmentResponse = (currentPage: AssessmentPage, reqBody: RequestBody) => {
  const pageData: AssessmentPage = currentPage

  let validationErrors: ValidationErrors = null

  function answerInBody(questionAndAnswer: QuestionsAndAnswers) {
    return reqBody[questionAndAnswer.question.id]
  }

  function isMissingRequiredField(questionAndAnswer: QuestionsAndAnswers) {
    if (questionAndAnswer.question.type === 'ADDRESS') {
      return (
        !reqBody.addressLine1 &&
        !reqBody.addressLine2 &&
        !reqBody.addressTown &&
        !reqBody.addressCounty &&
        !reqBody.addressPostcode
      )
    }
    return !answerInBody(questionAndAnswer)
  }

  pageData?.questionsAndAnswers?.forEach(questionAndAnswer => {
    if (questionAndAnswer.question.validationType === 'MANDATORY') {
      const isMissingAnswer = isMissingRequiredField(questionAndAnswer)
      if (isMissingAnswer) {
        const newValidationError: ValidationError = {
          validationType: 'MANDATORY',
          questionId: questionAndAnswer.question.id,
        }
        validationErrors = validationErrors ? [...validationErrors, newValidationError] : [newValidationError]
      }
    }

    if (questionAndAnswer.question.type === 'ADDRESS') {
      if (
        (reqBody.addressLine1 && reqBody.addressLine1.length > 500) ||
        (reqBody.addressLine2 && reqBody.addressLine2.length > 500) ||
        (reqBody.addressTown && reqBody.addressTown.length > 500) ||
        (reqBody.addressCounty && reqBody.addressCounty.length > 500) ||
        (reqBody.addressPostcode && reqBody.addressPostcode.length > 500)
      ) {
        const newValidationError: ValidationError = {
          validationType: 'MAX_CHARACTER_LIMIT_ADDRESS',
          questionId: questionAndAnswer.question.id,
        }
        validationErrors = validationErrors ? [...validationErrors, newValidationError] : [newValidationError]
      }
    }

    if (questionAndAnswer.question.type === 'SHORT_TEXT' && answerInBody(questionAndAnswer)) {
      if (answerInBody(questionAndAnswer).length > 500) {
        const newValidationError: ValidationError = {
          validationType: 'MAX_CHARACTER_LIMIT_SHORT_TEXT',
          questionId: questionAndAnswer.question.id,
        }
        validationErrors = validationErrors ? [...validationErrors, newValidationError] : [newValidationError]
      }
    }

    if (questionAndAnswer.question.type === 'LONG_TEXT' && answerInBody(questionAndAnswer)) {
      if (answerInBody(questionAndAnswer).length > 3000) {
        const newValidationError: ValidationError = {
          validationType: 'MAX_CHARACTER_LIMIT_LONG_TEXT',
          questionId: questionAndAnswer.question.id,
        }
        validationErrors = validationErrors ? [...validationErrors, newValidationError] : [newValidationError]
      }
    }
  })

  return validationErrors
}

export default validateAssessmentResponse

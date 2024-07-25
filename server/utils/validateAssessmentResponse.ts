import { ValidationError, ValidationErrors } from '../data/model/immediateNeedsReport'
import { ResettlementReportUserInput, ResettlementReportUserQuestionAndAnswer } from './assessmentHelperTypes'

const validateAssessmentResponse = (userInput: ResettlementReportUserInput) => {
  let validationErrors: ValidationErrors = null

  userInput?.flattenedQuestionsOnPage.forEach(questionAndAnswer => {
    if (questionAndAnswer.question.validationType === 'MANDATORY') {
      const isMissingAnswer = isMissingRequiredField(
        questionAndAnswer.question.id,
        questionAndAnswer.question.type,
        userInput.questionsAndAnswers,
      )
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
        answerInBody(questionAndAnswer.question.id, userInput.questionsAndAnswers, 'addressLine1')?.length > 500 ||
        answerInBody(questionAndAnswer.question.id, userInput.questionsAndAnswers, 'addressLine2')?.length > 500 ||
        answerInBody(questionAndAnswer.question.id, userInput.questionsAndAnswers, 'addressTown')?.length > 500 ||
        answerInBody(questionAndAnswer.question.id, userInput.questionsAndAnswers, 'addressCounty')?.length > 500 ||
        answerInBody(questionAndAnswer.question.id, userInput.questionsAndAnswers, 'addressPostcode')?.length > 500
      ) {
        const newValidationError: ValidationError = {
          validationType: 'MAX_CHARACTER_LIMIT_ADDRESS',
          questionId: questionAndAnswer.question.id,
        }
        validationErrors = validationErrors ? [...validationErrors, newValidationError] : [newValidationError]
      }
    }

    if (
      questionAndAnswer.question.type === 'SHORT_TEXT' &&
      answerInBody(questionAndAnswer.question.id, userInput.questionsAndAnswers)
    ) {
      if (answerInBody(questionAndAnswer.question.id, userInput.questionsAndAnswers).length > 500) {
        const newValidationError: ValidationError = {
          validationType: 'MAX_CHARACTER_LIMIT_SHORT_TEXT',
          questionId: questionAndAnswer.question.id,
        }
        validationErrors = validationErrors ? [...validationErrors, newValidationError] : [newValidationError]
      }
    }

    if (
      questionAndAnswer.question.type === 'LONG_TEXT' &&
      answerInBody(questionAndAnswer.question.id, userInput.questionsAndAnswers)
    ) {
      if (answerInBody(questionAndAnswer.question.id, userInput.questionsAndAnswers).length > 3000) {
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

function answerInBody(
  questionId: string,
  allUserQuestionsAndAnswers: ResettlementReportUserQuestionAndAnswer[],
  subField: string = undefined,
) {
  return allUserQuestionsAndAnswers.find(it => it.questionId === questionId && it.subField === subField)?.answer
}

function isMissingRequiredField(
  questionId: string,
  questionType: string,
  allUserQuestionsAndAnswers: ResettlementReportUserQuestionAndAnswer[],
) {
  if (questionType === 'ADDRESS') {
    return (
      !answerInBody(questionId, allUserQuestionsAndAnswers, 'addressLine1') &&
      !answerInBody(questionId, allUserQuestionsAndAnswers, 'addressLine2') &&
      !answerInBody(questionId, allUserQuestionsAndAnswers, 'addressTown') &&
      !answerInBody(questionId, allUserQuestionsAndAnswers, 'addressCounty') &&
      !answerInBody(questionId, allUserQuestionsAndAnswers, 'addressPostcode')
    )
  }
  return !answerInBody(questionId, allUserQuestionsAndAnswers)
}

export default validateAssessmentResponse

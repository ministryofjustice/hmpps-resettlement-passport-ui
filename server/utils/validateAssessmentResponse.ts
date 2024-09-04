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
        getAnswerToQuestion(questionAndAnswer.question.id, userInput.questionsAndAnswers, 'addressLine1')?.length >
          500 ||
        getAnswerToQuestion(questionAndAnswer.question.id, userInput.questionsAndAnswers, 'addressLine2')?.length >
          500 ||
        getAnswerToQuestion(questionAndAnswer.question.id, userInput.questionsAndAnswers, 'addressTown')?.length >
          500 ||
        getAnswerToQuestion(questionAndAnswer.question.id, userInput.questionsAndAnswers, 'addressCounty')?.length >
          500 ||
        getAnswerToQuestion(questionAndAnswer.question.id, userInput.questionsAndAnswers, 'addressPostcode')?.length >
          500
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
      getAnswerToQuestion(questionAndAnswer.question.id, userInput.questionsAndAnswers)
    ) {
      if (getAnswerToQuestion(questionAndAnswer.question.id, userInput.questionsAndAnswers).length > 500) {
        const newValidationError: ValidationError = {
          validationType: 'MAX_CHARACTER_LIMIT_SHORT_TEXT',
          questionId: questionAndAnswer.question.id,
        }
        validationErrors = validationErrors ? [...validationErrors, newValidationError] : [newValidationError]
      }
    }

    if (
      questionAndAnswer.question.type === 'LONG_TEXT' &&
      getAnswerToQuestion(questionAndAnswer.question.id, userInput.questionsAndAnswers)
    ) {
      if (getAnswerToQuestion(questionAndAnswer.question.id, userInput.questionsAndAnswers).length > 3000) {
        const newValidationError: ValidationError = {
          validationType: 'MAX_CHARACTER_LIMIT_LONG_TEXT',
          questionId: questionAndAnswer.question.id,
        }
        validationErrors = validationErrors ? [...validationErrors, newValidationError] : [newValidationError]
      }
    }

    // TODO what if the answer is in the wrong format for regex validation?
    if (
      questionAndAnswer.question.customValidation &&
      typeof getAnswerToQuestion(questionAndAnswer.question.id, userInput.questionsAndAnswers) === 'string'
    ) {
      const regex = new RegExp(questionAndAnswer.question.customValidation.regex)
      const answer = getAnswerToQuestion(questionAndAnswer.question.id, userInput.questionsAndAnswers) as string
      // TODO deal with case of optional question and blank answer
      if (!regex.test(answer)) {
        const newValidationError: ValidationError = {
          validationType: 'CUSTOM',
          questionId: questionAndAnswer.question.id,
          customErrorMessage: questionAndAnswer.question.customValidation.message,
        }
        validationErrors = validationErrors ? [...validationErrors, newValidationError] : [newValidationError]
      }
    }
  })

  return validationErrors
}

function getAnswerToQuestion(
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
      !getAnswerToQuestion(questionId, allUserQuestionsAndAnswers, 'addressLine1') &&
      !getAnswerToQuestion(questionId, allUserQuestionsAndAnswers, 'addressLine2') &&
      !getAnswerToQuestion(questionId, allUserQuestionsAndAnswers, 'addressTown') &&
      !getAnswerToQuestion(questionId, allUserQuestionsAndAnswers, 'addressCounty') &&
      !getAnswerToQuestion(questionId, allUserQuestionsAndAnswers, 'addressPostcode')
    )
  }
  return !getAnswerToQuestion(questionId, allUserQuestionsAndAnswers)
}

export default validateAssessmentResponse

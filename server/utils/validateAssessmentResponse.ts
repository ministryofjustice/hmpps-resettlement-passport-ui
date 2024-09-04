import { ValidationError, ValidationErrors } from '../data/model/immediateNeedsReport'
import { ResettlementReportUserInput, ResettlementReportUserQuestionAndAnswer } from './assessmentHelperTypes'

const validateAssessmentResponse = (userInput: ResettlementReportUserInput) => {
  let validationErrors: ValidationErrors = null

  userInput?.flattenedQuestionsOnPage.forEach(questionAndAnswer => {
    const answerToQuestion = getAnswerToQuestion(questionAndAnswer.question.id, userInput.questionsAndAnswers)

    if (questionAndAnswer.question.validationType === 'MANDATORY') {
      const isMissingAnswer = isMissingRequiredField(
        questionAndAnswer.question.id,
        questionAndAnswer.question.type,
        userInput.questionsAndAnswers,
      )
      if (isMissingAnswer) {
        const newValidationError: ValidationError = {
          validationType: 'MANDATORY_INPUT',
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

    if (questionAndAnswer.question.type === 'SHORT_TEXT' && answerToQuestion) {
      if (answerToQuestion.length > 500) {
        const newValidationError: ValidationError = {
          validationType: 'MAX_CHARACTER_LIMIT_SHORT_TEXT',
          questionId: questionAndAnswer.question.id,
        }
        validationErrors = validationErrors ? [...validationErrors, newValidationError] : [newValidationError]
      }
    }

    if (questionAndAnswer.question.type === 'LONG_TEXT' && answerToQuestion) {
      if (answerToQuestion.length > 3000) {
        const newValidationError: ValidationError = {
          validationType: 'MAX_CHARACTER_LIMIT_LONG_TEXT',
          questionId: questionAndAnswer.question.id,
        }
        validationErrors = validationErrors ? [...validationErrors, newValidationError] : [newValidationError]
      }
    }

    if (questionAndAnswer.question.customValidation && typeof answerToQuestion === 'string') {
      const regex = new RegExp(questionAndAnswer.question.customValidation.regex)
      const answer = answerToQuestion as string
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

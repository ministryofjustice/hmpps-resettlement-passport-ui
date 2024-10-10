import {
  ApiQuestionOption,
  ApiQuestionsAndAnswer,
  ValidationError,
  ValidationErrors,
} from '../data/model/immediateNeedsReport'
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

    validationErrors = validateCheckboxFreetextField(questionAndAnswer, answerToQuestion, validationErrors)
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

function validateCheckboxFreetextField(
  questionAndAnswer: ApiQuestionsAndAnswer,
  answerToQuestion: string | string[],
  validationErrors: ValidationErrors,
): ValidationErrors {
  let returnedValidationErrors = validationErrors
  if (
    questionAndAnswer.question.type === 'CHECKBOX' &&
    checkFreeText(questionAndAnswer.question.options) !== undefined
  ) {
    const freeTextOption = checkFreeText(questionAndAnswer.question.options)
    const optionAnswer = checkContains(answerToQuestion, freeTextOption.id)
    if (optionAnswer !== undefined) {
      const freeTextValue = optionAnswer.slice(freeTextOption.id.length + 2).trim()
      if (freeTextValue.length <= 0) {
        const newValidationError: ValidationError = {
          validationType: 'MANDATORY_INPUT',
          questionId: questionAndAnswer.question.id,
          optionId: freeTextOption.id,
        }
        returnedValidationErrors = validationErrors ? [...validationErrors, newValidationError] : [newValidationError]
      }
    }
  }
  return returnedValidationErrors
}

function checkFreeText(options: ApiQuestionOption[]) {
  return options.find(option => option.freeText === true)
}

function checkContains(value: string | string[], searchString: string): string {
  if (typeof value === 'string' && value.includes(searchString)) {
    return value
  }
  if (Array.isArray(value)) {
    return value.find(item => item.includes(searchString))
  }
  return undefined
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

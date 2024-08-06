import {
  AnswerType,
  QuestionsAndAnswers,
  SubmittedInput,
  SubmittedQuestionAndAnswer,
} from '../data/model/immediateNeedsReport'
import { ResettlementReportUserInput, ResettlementReportUserQuestionAndAnswer } from './assessmentHelperTypes'

export const formatAssessmentResponse = (userInput: ResettlementReportUserInput) => {
  const filteredQuestionsAndAnswers = userInput.flattenedQuestionsOnPage.map(questionAndAnswer => {
    const { id, title, type } = questionAndAnswer.question
    const answers = userInput.questionsAndAnswers.filter(it => it.questionId === questionAndAnswer.question.id)

    let checkboxAnswers: string[] = []
    // Check if the value is a string, if so, convert it to an array with a single element
    if (type === 'CHECKBOX' && answers[0]?.answer) {
      if (typeof answers[0].answer === 'string') {
        checkboxAnswers = [answers[0].answer]
      } else {
        // If it's already an array, use it directly
        checkboxAnswers = [...answers[0].answer]
      }
    }

    let displayText
    if (type === 'RADIO') {
      displayText = questionAndAnswer.question.options.find(option => option.id === answers[0]?.answer)?.displayText
    } else if (type === 'CHECKBOX') {
      displayText = questionAndAnswer.question.options
        .filter(option => checkboxAnswers?.includes(option.id))
        ?.map(option => option.displayText)
    } else {
      displayText = ''
    }

    let answerType: AnswerType
    if (type === 'ADDRESS') {
      answerType = 'MapAnswer'
    } else if (type === 'CHECKBOX') {
      answerType = 'ListAnswer'
    } else {
      answerType = 'StringAnswer'
    }

    let answer
    if (type === 'ADDRESS') {
      answer = getAddressValuesFromBody(questionAndAnswer.question.id, answers)
    } else if (type === 'CHECKBOX') {
      answer = checkboxAnswers
    } else {
      answer = answers[0]?.answer
    }

    return {
      question: id,
      questionTitle: title,
      questionType: type,
      pageId: userInput.pageId,
      answer: {
        answer,
        displayText: displayText || answers[0]?.answer,
        '@class': answerType,
      },
    }
  })

  const formattedResponse: SubmittedInput = {
    questionsAndAnswers: filteredQuestionsAndAnswers,
    version: null,
  }

  return formattedResponse
}

export function getDisplayTextFromQandA(questionAndAnswer: QuestionsAndAnswers) {
  let displayText
  const { type } = questionAndAnswer.question
  if (type === 'RADIO') {
    displayText = questionAndAnswer.question.options.find(
      answer => answer.id === questionAndAnswer.answer?.answer,
    )?.displayText
  } else if (type === 'CHECKBOX') {
    displayText = questionAndAnswer.question.options
      .filter(option => (questionAndAnswer.answer?.answer as string[])?.includes(option.id))
      ?.map(option => option.displayText)
  } else if (questionAndAnswer.answer && questionAndAnswer.answer['@class'] === 'StringAnswer') {
    displayText = questionAndAnswer.answer?.answer as string
  } else {
    displayText = ''
  }
  return displayText
}

export function toSubmittedQuestionAndAnswer(questionsAndAnswers: QuestionsAndAnswers): SubmittedQuestionAndAnswer {
  return {
    question: questionsAndAnswers.question.id,
    questionTitle: questionsAndAnswers.question.title,
    pageId: questionsAndAnswers.originalPageId,
    questionType: questionsAndAnswers.question.type,
    answer: questionsAndAnswers.answer
      ? {
          answer: questionsAndAnswers.answer.answer,
          displayText: getDisplayTextFromQandA(questionsAndAnswers),
          '@class': questionsAndAnswers.answer['@class'],
        }
      : null,
  }
}

function getAddressValuesFromBody(
  questionId: string,
  userQuestionAndAnswers: ResettlementReportUserQuestionAndAnswer[],
) {
  return [
    {
      addressLine1: userQuestionAndAnswers.find(it => it.questionId === questionId && it.subField === 'addressLine1')
        ?.answer as string,
    },
    {
      addressLine2: userQuestionAndAnswers.find(it => it.questionId === questionId && it.subField === 'addressLine2')
        ?.answer as string,
    },
    {
      addressTown: userQuestionAndAnswers.find(it => it.questionId === questionId && it.subField === 'addressTown')
        ?.answer as string,
    },
    {
      addressCounty: userQuestionAndAnswers.find(it => it.questionId === questionId && it.subField === 'addressCounty')
        ?.answer as string,
    },
    {
      addressPostcode: userQuestionAndAnswers.find(
        it => it.questionId === questionId && it.subField === 'addressPostcode',
      )?.answer as string,
    },
  ]
}

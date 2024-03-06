import { AnswerType, AssessmentPage, QuestionsAndAnswers, SubmittedInput } from '../data/model/BCST2Form'

type RequestBody = {
  [key: string]: string
}

const formatAssessmentResponse = (currentPage: string, reqBody: RequestBody) => {
  const pageData: AssessmentPage = JSON.parse(currentPage)

  function getAddressValuesFromBody() {
    return [
      {
        addressLine1: reqBody.addressLine1,
      },
      {
        addressLine2: reqBody.addressLine2,
      },
      {
        addressTown: reqBody.addressTown,
      },
      {
        addressCounty: reqBody.addressCounty,
      },
      {
        addressPostcode: reqBody.addressPostcode,
      },
    ]
  }

  const filteredQuestionsAndAnswers = pageData.questionsAndAnswers.map(questionAndAnswer => {
    const { id, title, type } = questionAndAnswer.question

    let checkboxAnswers: string[] = []
    // Check if the value is a string, if so, convert it to an array with a single element
    if (type === 'CHECKBOX' && reqBody[questionAndAnswer.question.id]) {
      if (typeof reqBody[questionAndAnswer.question.id] === 'string') {
        checkboxAnswers = [reqBody[questionAndAnswer.question.id]]
      } else {
        // If it's already an array, use it directly
        checkboxAnswers = [...reqBody[questionAndAnswer.question.id]]
      }
    }

    let displayText
    if (type === 'RADIO' || type === 'DROPDOWN') {
      displayText = questionAndAnswer.question.options.find(answer => answer.id === reqBody[id])?.displayText
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
      answer = getAddressValuesFromBody()
    } else if (type === 'CHECKBOX') {
      answer = checkboxAnswers
    } else {
      answer = reqBody[id]
    }

    return {
      question: id,
      questionTitle: title,
      questionType: type,
      pageId: pageData.id,
      answer: {
        answer,
        displayText: displayText || reqBody[id],
        '@class': answerType,
      },
    }
  })

  const formattedResponse: SubmittedInput = {
    questionsAndAnswers: filteredQuestionsAndAnswers,
  }

  return formattedResponse
}

export function getDisplayTextFromQandA(questionAndAnswer: QuestionsAndAnswers) {
  let displayText
  const { type } = questionAndAnswer.question
  if (type === 'RADIO' || type === 'DROPDOWN') {
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

export default formatAssessmentResponse

import { AnswerType, AssessmentPage, SubmittedInput } from '../data/model/BCST2Form'

type RequestBody = {
  [key: string]: string
}

const formatAssessmentResponse = (currentPage: string, reqBody: RequestBody) => {
  const pageData: AssessmentPage = JSON.parse(currentPage)
  let radioWithAddressValue: string
  console.log(reqBody)

  function getAddressValuesFromBody() {
    return [
      {
        [`addressLine1_${radioWithAddressValue}`]: reqBody[`addressLine1_${radioWithAddressValue}`],
      },
      {
        [`addressLine2_${radioWithAddressValue}`]: reqBody[`addressLine2_${radioWithAddressValue}`],
      },
      {
        [`addressTown_${radioWithAddressValue}`]: reqBody[`addressTown_${radioWithAddressValue}`],
      },
      {
        [`addressCounty_${radioWithAddressValue}`]: reqBody[`addressCounty_${radioWithAddressValue}`],
      },
      {
        [`addressPostcode_${radioWithAddressValue}`]: reqBody[`addressPostcode_${radioWithAddressValue}`],
      },
    ]
  }

  const filteredQuestionsAndAnswers = pageData.questionsAndAnswers.map(questionAndAnswer => {
    const { id, title, type } = questionAndAnswer.question

    let displayText
    if (type === 'RADIO' || type === 'RADIO_WITH_ADDRESS' || type === 'DROPDOWN') {
      displayText = questionAndAnswer.question.options.find(answer => answer.id === reqBody[id])?.displayText
    } else if (type === 'CHECKBOX') {
      displayText = questionAndAnswer.question.options
        .filter(option => reqBody[questionAndAnswer.question.id].includes(option.id))
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

    if (type === 'RADIO_WITH_ADDRESS') {
      radioWithAddressValue = reqBody[id]
    }

    return {
      question: id,
      questionTitle: title,
      questionType: type,
      pageId: pageData.id,
      answer: {
        answer: type === 'ADDRESS' ? getAddressValuesFromBody() : reqBody[id],
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

export default formatAssessmentResponse

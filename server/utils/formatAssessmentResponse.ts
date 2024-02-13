import { AnswerType, AssessmentPage, SubmittedInput } from '../data/model/BCST2Form'

type RequestBody = {
  [key: string]: string
}

const formatAssessmentResponse = (currentPage: string, reqBody: RequestBody) => {
  const pageData: AssessmentPage = JSON.parse(currentPage)
  let radioWithAddressValue: string

  function getAddressValuesFromBody() {
    return [
      {
        [`addressLine1_${radioWithAddressValue}`]: reqBody[`addressLine1_${radioWithAddressValue}`],
        [`addressLine2_${radioWithAddressValue}`]: reqBody[`addressLine2_${radioWithAddressValue}`],
        [`addressTown_${radioWithAddressValue}`]: reqBody[`addressTown_${radioWithAddressValue}`],
        [`addressCounty_${radioWithAddressValue}`]: reqBody[`addressCounty_${radioWithAddressValue}`],
        [`addressPostcode_${radioWithAddressValue}`]: reqBody[`addressPostcode_${radioWithAddressValue}`],
      },
    ]
  }

  const filteredQuestionsAndAnswers = pageData.questionsAndAnswers.map(questionAndAnswer => {
    const { id, title, type } = questionAndAnswer.question

    let displayText
    if (type === 'RADIO' || type === 'RADIO_WITH_ADDRESS' || type === 'DROPDOWN') {
      displayText = questionAndAnswer.question.options.find(answer => answer.id === reqBody[id])?.displayText
    } else {
      displayText = ''
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
        '@class': (type === 'ADDRESS' ? 'MapAnswer' : 'StringAnswer') as AnswerType,
      },
    }
  })

  const formattedResponse: SubmittedInput = {
    questionsAndAnswers: filteredQuestionsAndAnswers,
  }

  return formattedResponse
}

export default formatAssessmentResponse

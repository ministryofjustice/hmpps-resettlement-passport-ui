import { AnswerType, AssessmentPage, SubmittedInput } from '../data/model/BCST2Form'

type RequestBody = {
  [key: string]: string
}

const formatAssessmentResponse = (currentPage: string, reqBody: RequestBody) => {
  const pageData: AssessmentPage = JSON.parse(currentPage)

  const filteredQuestionsAndAnswers = pageData.questionsAndAnswers
    .filter(questionAndAnswer => {
      const { id } = questionAndAnswer.question
      return reqBody[id] !== null && reqBody[id] !== undefined // only return questions which contain an answer
    })
    .map(questionAndAnswer => {
      const { id, title, type } = questionAndAnswer.question

      let displayText
      if (type === 'RADIO' || type === 'RADIO_WITH_ADDRESS' || type === 'DROPDOWN') {
        displayText = questionAndAnswer.question.options.find(answer => answer.id === reqBody[id]).displayText
      } else {
        displayText = ''
      }

      return {
        question: id,
        questionTitle: title,
        pageId: pageData.id,
        answer: {
          answer: reqBody[id],
          displayText: displayText || reqBody[id],
          '@class': 'StringAnswer' as AnswerType,
        },
      }
    })

  const formattedResponse: SubmittedInput = {
    questionsAndAnswers: filteredQuestionsAndAnswers,
  }

  return formattedResponse
}

export default formatAssessmentResponse

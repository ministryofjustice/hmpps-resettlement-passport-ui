import { AssessmentPage } from '../data/model/BCST2Form'

type RequestBody = {
  [key: string]: string
}

const formatAssessmentResponse = (currentPage: string, reqBody: RequestBody) => {
  const pageData: AssessmentPage = JSON.parse(currentPage)

  const filteredQuestionsAndAnswers = pageData.questionsAndAnswers
    .filter(questionAndAnswer => {
      const { id } = questionAndAnswer.question
      return reqBody[id] !== null && reqBody[id] !== undefined
    })
    .map(questionAndAnswer => {
      const { id } = questionAndAnswer.question

      return {
        question: id,
        answer: {
          answer: reqBody[id],
          '@class': 'StringAnswer',
        },
      }
    })

  const formattedResponse = {
    questionsAndAnswers: filteredQuestionsAndAnswers,
  }

  return formattedResponse
}

export default formatAssessmentResponse

import { AssessmentPage } from '../data/model/BCST2Form'

const formatAssessmentResponse = (currentPage: string, reqBody: any) => {
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

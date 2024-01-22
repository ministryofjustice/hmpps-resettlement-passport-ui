export type NextPage = {
  nextPageId?: string
  error?: string
}

export type QuestionOptions = {
  id: string
  displayText: string
  description?: string
}

export type QuestionsAndAnswers = {
  question: {
    id: string
    title?: string
    subTitle?: string
    type?: string
    options?: QuestionOptions[]
  }
  answer?: any
}

export type AssessmentPage = {
  error?: string
  id?: string
  title?: string
  questionsAndAnswers?: QuestionsAndAnswers[]
}

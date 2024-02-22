type QuestionsAndAnswers = {
  questionTitle: string
  answer: string
}

export type AssessmentsInformation = {
  error?: string
  lastUpdated?: string
  updatedBy?: string
  questionsAndAnswers?: QuestionsAndAnswers[]
}

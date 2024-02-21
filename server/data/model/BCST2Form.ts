export type NextPage = {
  nextPageId?: string
  error?: string
}

export type QuestionOptions = {
  id: string
  displayText: string
  description?: string
}

export type AnswerType = 'StringAnswer' | 'MapAnswer' | 'ListAnswer'

export type Answer = {
  answer?: string | string[] | { [key: string]: string }[]
  '@class'?: AnswerType
}

export type QuestionsAndAnswers = {
  question: {
    id: string
    title?: string
    subTitle?: string
    type?: string
    options?: QuestionOptions[]
  }
  answer?: Answer
}

export type AssessmentPage = {
  error?: string
  id?: string
  title?: string
  questionsAndAnswers?: QuestionsAndAnswers[]
}

export type SubmittedQuestionAndAnswer = {
  question: string
  questionTitle: string
  pageId: string
  answer: {
    answer: string | string[] | { [key: string]: string }[]
    displayText: string | string[]
    '@class': AnswerType
  }
}

export type SubmittedInput = {
  questionsAndAnswers?: SubmittedQuestionAndAnswer[]
}

import { ApiQuestionsAndAnswer } from '../data/model/immediateNeedsReport'

export type RequestBody = {
  [key: string]: string
}

export type ResettlementReportUserInput = {
  questionsAndAnswers: ResettlementReportUserQuestionAndAnswer[]
  flattenedQuestionsOnPage: ApiQuestionsAndAnswer[]
  pageId: string
}

export type ResettlementReportUserQuestionAndAnswer = {
  questionId: string
  subField?: string
  answer: string | string[]
}

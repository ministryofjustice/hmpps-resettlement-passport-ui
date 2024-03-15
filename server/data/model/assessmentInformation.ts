type QuestionsAndAnswers = {
  questionTitle: string
  answer?: string
  originalPageId: string
}

export type AssessmentsInformation = {
  error?: string
  originalAssessment?: Assessment
  latestAssessment?: Assessment
}

type Assessment = {
  assessmentType: string
  lastUpdated: string
  updatedBy: string
  questionsAndAnswers: QuestionsAndAnswers[]
}

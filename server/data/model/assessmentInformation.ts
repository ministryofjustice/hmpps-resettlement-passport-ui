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
  assessmentType: AssessmentType
  lastUpdated: string
  updatedBy: string
  questionsAndAnswers: QuestionsAndAnswers[]
}

export type AssessmentType = 'BCST2' | 'RESETTLEMENT_PLAN'

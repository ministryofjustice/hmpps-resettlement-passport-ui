import { type } from 'node:os'

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

export type AssessmentSkipRequest = {
  reason: AssessmentSkipReason
  moreInfo?: string
}

export type AssessmentSkipReason = (typeof assessmentSkipReasons)[number]

export const assessmentSkipReasons = [
  'COMPLETED_IN_OASYS',
  'COMPLETED_IN_ANOTHER_PRISON',
  'EARLY_RELEASE',
  'TRANSFER',
  'OTHER',
] as const

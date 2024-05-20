export type AssessmentStatus = {
  pathway: string
  assessmentStatus: PathwayAssessmentStatus
}

export type AssessmentsSummary = {
  error?: string
  results?: AssessmentStatus[]
}

export type PathwayAssessmentStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETE' | 'SUBMITTED'

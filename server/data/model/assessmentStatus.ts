export type AssessmentStatus = {
  pathway: string
  assessmentStatus: string
}

export type AssessmentsSummary = {
  error?: string
  results?: AssessmentStatus[]
}

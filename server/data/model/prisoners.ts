export type PrisonersList = {
  content: Prisoners[]
  page: number
  last: boolean
}

type Prisoners = {
  firstName: string
  middleNames?: string
  lastName: string
  releaseDate?: Date
  releaseType: string
  lastUpdatedDate?: Date
  status?: string[]
  pathwayStatus?: string
  homeDetentionCurfewEligibilityDate?: Date
  paroleEligibilityDate?: Date
  releaseEligibilityDate?: Date
  releaseEligibilityType?: string
  releaseOnTemporaryLicenceDate?: Date
  assessmentRequired: boolean
}

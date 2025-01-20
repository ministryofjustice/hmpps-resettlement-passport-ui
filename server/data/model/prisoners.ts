import { PathwayStatus } from '../../@types/express'

export type PrisonersList = {
  content: Prisoners[]
  page: number
  last: boolean
  pageSize: number
  sortName: string
  totalElements: number
}

type Prisoners = {
  prisonerNumber: string
  firstName: string
  middleNames?: string
  lastName: string
  releaseDate?: string
  releaseType: string
  lastUpdatedDate?: string
  status?: PathwayStatus[]
  pathwayStatus?: string
  homeDetentionCurfewEligibilityDate?: string
  paroleEligibilityDate?: string
  releaseEligibilityDate?: string
  releaseEligibilityType?: string
  releaseOnTemporaryLicenceDate?: string
  assessmentRequired: boolean
  assignedWorkerFirstname?: string
  assignedWorkerLastname?: string
  lastReport?: {
    type: string
    dateCompleted: string
  } | null
}

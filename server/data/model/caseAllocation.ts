export type CaseAllocationRequestBody = {
  nomsIds: string[]
  staffId?: number
  prisonId: string
}

export type CaseAllocationUnassignRequestBody = {
  nomsIds: string[]
}

export type CaseAllocationResponseItem = {
  nomsId: string
  staffId?: number
  staffFirstname: string
  staffLastname: string
}

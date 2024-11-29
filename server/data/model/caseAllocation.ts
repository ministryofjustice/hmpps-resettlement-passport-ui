export type CaseAllocationRequestBody = {
  nomsIds: string[]
  staffId?: number
  staffFirstName: string
  staffLastName: string
  prisonId: string
}

export type CaseAllocationUnassignRequestBody = {
  nomsIds: string[]
}

export type CaseAllocationResponseItem = {
  nomsId: string
  staffId?: number
  staffFirstName: string
  staffLastName: string
}

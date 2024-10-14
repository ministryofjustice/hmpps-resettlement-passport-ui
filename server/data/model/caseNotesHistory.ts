type CaseNoteContent = {
  caseNoteId: string
  pathway: string
  creationDateTime: string
  occurenceDateTime: string
  createdBy: string
  text: string
}

export type CaseNote = {
  content: CaseNoteContent[]
  pageSize: number
  page: number
  sortName: string
  totalElements: number
  last: boolean
}

export type CaseNotesHistory = {
  error?: string
  results?: CaseNote
}

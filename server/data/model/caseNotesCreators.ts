export type CaseNotesCreator = {
  createdBy: string
  userId: string
}

export type CaseNotesCreators = {
  error?: string
  results?: CaseNotesCreator[]
}

export type ResetProfileValidationError = {
  id: string
  displayText: string
}

export const MANDATORY_REASON: ResetProfileValidationError = {
  id: 'MANDATORY_REASON',
  displayText: 'Select a reason why you are resetting the reports and statuses',
}
export const MANDATORY_OTHER_TEXT: ResetProfileValidationError = {
  id: 'MANDATORY_OTHER_TEXT',
  displayText: 'Other reason cannot be blank',
}
export const MAX_CHARACTER_LIMIT_LONG_TEXT: ResetProfileValidationError = {
  id: 'MAX_CHARACTER_LIMIT_LONG_TEXT',
  displayText: 'Other reason must be 3,000 characters or less',
}

export type ResetReason = {
  resetReason: 'RECALL_TO_PRISON' | 'RETURN_ON_NEW_SENTENCE' | 'OTHER'
  additionalDetails: string
}

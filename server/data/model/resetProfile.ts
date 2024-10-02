export type ResetProfileValidationError = 'MANDATORY_REASON' | 'MANDATORY_OTHER_TEXT' | 'MAX_CHARACTER_LIMIT_LONG_TEXT'

export type ResetReason = {
  resetReason: 'RECALL_TO_PRISON' | 'RETURN_ON_NEW_SENTENCE' | 'OTHER'
  additionalDetails?: string
}

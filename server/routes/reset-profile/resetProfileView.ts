import { PrisonerData } from '../../@types/express'
import { ResetProfileValidationError, ResetReason } from '../../data/model/resetProfile'
import View, { ErrorMessage } from '../view'

export default class ResetProfileView implements View {
  constructor(
    private readonly prisonerData: PrisonerData,
    private readonly validationError?: ResetProfileValidationError,
    private readonly resetReason?: ResetReason,
    private readonly additionalDetails?: string,
    private readonly userName?: string,
    private readonly resetReasonDisplayText?: string,
  ) {
    // no op
  }

  get renderArgs(): {
    prisonerData: PrisonerData
    validationError: ResetProfileValidationError
    resetReason: ResetReason
    additionalDetails: string
    userName: string
    resetReasonDisplayText: string
    errors: ErrorMessage[]
  } {
    return {
      prisonerData: this.prisonerData,
      validationError: this.validationError,
      resetReason: this.resetReason,
      additionalDetails: this.additionalDetails,
      userName: this.userName,
      resetReasonDisplayText: this.resetReasonDisplayText,
      errors: null,
    }
  }
}

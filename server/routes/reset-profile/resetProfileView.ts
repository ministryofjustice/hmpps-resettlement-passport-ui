import { PrisonerData } from '../../@types/express'
import View, { ErrorMessage } from '../view'

export default class ResetProfileView implements View {
  constructor(private readonly prisonerData: PrisonerData, private readonly resetProfileEnabled: boolean) {
    // no op
  }

  get renderArgs(): {
    prisonerData: PrisonerData
    resetProfileEnabled: boolean
    errors: ErrorMessage[]
  } {
    return {
      prisonerData: this.prisonerData,
      resetProfileEnabled: this.resetProfileEnabled,
      errors: null,
    }
  }
}

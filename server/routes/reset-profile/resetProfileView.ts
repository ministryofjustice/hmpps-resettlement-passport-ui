import { PrisonerData } from '../../@types/express'
import View, { ErrorMessage } from '../view'

export default class ResetProfileView implements View {
  constructor(private readonly prisonerData: PrisonerData) {
    // no op
  }

  get renderArgs(): {
    prisonerData: PrisonerData
    errors: ErrorMessage[]
  } {
    return {
      prisonerData: this.prisonerData,
      errors: null,
    }
  }
}

import View, { ErrorMessage } from '../view'
import { PrisonerData } from '../../@types/express'

export default class BCST2FormView implements View {
  constructor(private readonly prisonerData: PrisonerData, private readonly errors: ErrorMessage[] = []) {}

  get renderArgs(): {
    prisonerData: PrisonerData
    errors: ErrorMessage[]
  } {
    return {
      prisonerData: this.prisonerData,
      errors: this.errors.length !== 0 ? this.errors : null,
    }
  }
}

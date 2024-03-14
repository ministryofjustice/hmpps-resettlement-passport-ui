import View, { ErrorMessage } from '../view'
import { PrisonerData } from '../../@types/express'

export default class PrintView implements View {
  constructor(private readonly prisonerData: PrisonerData) {}

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

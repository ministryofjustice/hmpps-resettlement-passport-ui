import View, { ErrorMessage } from '../view'
import { PrisonerData } from '../../@types/express'

export default class AddAppointmentView implements View {
  constructor(private readonly prisonerData: PrisonerData, private readonly errors: ErrorMessage[] = []) {
    // no op
  }

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

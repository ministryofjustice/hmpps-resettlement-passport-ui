import View, { ErrorMessage } from '../view'
import { PrisonersList } from '../../data/model/prisoners'

export default class AssignCaseView implements View {
  constructor(private readonly prisonersList: PrisonersList, private readonly errors: ErrorMessage[]) {
    // no op
  }

  get renderArgs(): {
    prisonersList: PrisonersList
    errors: ErrorMessage[]
  } {
    return {
      prisonersList: this.prisonersList,
      errors: this.errors.length !== 0 ? this.errors : null,
    }
  }
}

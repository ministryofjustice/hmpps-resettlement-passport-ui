import View, { ErrorMessage } from '../view'
import { PrisonersList } from '../../data/model/prisoners'
import { PrisonSelect } from '../../data/model/prison'

export default class StaffDashboardView implements View {
  constructor(private readonly prisonersList: PrisonersList, private readonly errors: ErrorMessage[]) {}

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

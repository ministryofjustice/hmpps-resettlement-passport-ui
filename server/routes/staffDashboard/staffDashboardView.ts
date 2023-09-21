import View, { ErrorMessage } from '../view'
import { PrisonersList } from '../../data/model/prisoners'

export default class StaffDashboardView implements View {
  constructor(
    private readonly prisonersList: PrisonersList,
    private readonly errors: ErrorMessage[],
    private readonly searchInput: string,
  ) {}

  get renderArgs(): {
    prisonersList: PrisonersList
    errors: ErrorMessage[]
    searchInput: string
  } {
    return {
      prisonersList: this.prisonersList,
      errors: this.errors.length !== 0 ? this.errors : null,
      searchInput: this.searchInput,
    }
  }
}

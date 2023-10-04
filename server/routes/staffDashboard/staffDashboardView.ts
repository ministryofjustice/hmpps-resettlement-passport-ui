import View, { ErrorMessage } from '../view'
import { PrisonersList } from '../../data/model/prisoners'

export default class StaffDashboardView implements View {
  constructor(
    private readonly prisonersList: PrisonersList,
    private readonly errors: ErrorMessage[],
    private readonly searchInput: string,
    private readonly releaseTime: string,
    private readonly page: string,
  ) {}

  get renderArgs(): {
    prisonersList: PrisonersList
    errors: ErrorMessage[]
    searchInput: string
    releaseTime: string
    page: string
  } {
    return {
      prisonersList: this.prisonersList,
      errors: this.errors.length !== 0 ? this.errors : null,
      searchInput: this.searchInput,
      releaseTime: this.releaseTime,
      page: this.page,
    }
  }
}

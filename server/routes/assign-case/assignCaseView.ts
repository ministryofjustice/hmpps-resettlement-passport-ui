import View, { ErrorMessage } from '../view'
import { PrisonersList } from '../../data/model/prisoners'
import { Pagination } from '../../data/model/pagination'

export default class AssignCaseView implements View {
  constructor(
    private readonly prisonersList: PrisonersList,
    private readonly pagination: Pagination,
    private readonly errors: ErrorMessage[],
  ) {
    // no op
  }

  get renderArgs(): {
    prisonersList: PrisonersList
    pagination: Pagination
    errors: ErrorMessage[]
  } {
    return {
      prisonersList: this.prisonersList,
      pagination: this.pagination,
      errors: this.errors.length !== 0 ? this.errors : null,
    }
  }
}

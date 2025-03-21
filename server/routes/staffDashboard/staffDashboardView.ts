import View, { ErrorMessage } from '../view'
import { PrisonersList } from '../../data/model/prisoners'
import { Pagination } from '../../data/model/pagination'

export default class StaffDashboardView implements View {
  constructor(
    private readonly prisonersList: PrisonersList,
    private readonly errors: ErrorMessage[],
    private readonly searchInput: string,
    private readonly releaseTime: string,
    private readonly pagination: Pagination,
    private readonly pathwayView: string,
    private readonly pathwayStatus: string,
    private readonly sortField: string,
    private readonly sortDirection: string,
    private readonly reportType: string,
    private readonly watchList: string,
    private readonly lastReportCompleted: string,
  ) {
    // no op
  }

  get renderArgs(): {
    prisonersList: PrisonersList
    errors: ErrorMessage[]
    searchInput: string
    releaseTime: string
    pagination: Pagination
    pathwayView: string
    pathwayStatus: string
    sortField: string
    sortDirection: string
    reportType: string
    watchList: string
    lastReportCompleted: string
  } {
    return {
      prisonersList: this.prisonersList,
      errors: this.errors.length !== 0 ? this.errors : null,
      searchInput: this.searchInput,
      releaseTime: this.releaseTime,
      pagination: this.pagination,
      pathwayView: this.pathwayView,
      pathwayStatus: this.pathwayStatus,
      sortField: this.sortField,
      sortDirection: this.sortDirection,
      reportType: this.reportType,
      watchList: this.watchList,
      lastReportCompleted: this.lastReportCompleted,
    }
  }
}

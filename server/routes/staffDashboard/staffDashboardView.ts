import View, { ErrorMessage } from '../view'
import { PrisonersList } from '../../data/model/prisoners'
import { PrisonerCountMetrics } from '../../data/model/metrics'

export default class StaffDashboardView implements View {
  constructor(
    private readonly prisonersList: PrisonersList,
    private readonly errors: ErrorMessage[],
    private readonly searchInput: string,
    private readonly releaseTime: string,
    private readonly page: string,
    private readonly pathwayView: string,
    private readonly pathwayStatus: string,
    private readonly sortField: string,
    private readonly sortDirection: string,
    private readonly prisonerCountMetrics: PrisonerCountMetrics,
    private readonly reportType: string,
    private readonly assessmentRequired: string,
  ) {}

  get renderArgs(): {
    prisonersList: PrisonersList
    errors: ErrorMessage[]
    searchInput: string
    releaseTime: string
    page: string
    pathwayView: string
    pathwayStatus: string
    sortField: string
    sortDirection: string
    prisonerCountMetrics: PrisonerCountMetrics
    reportType: string
    assessmentRequired: string
  } {
    return {
      prisonersList: this.prisonersList,
      errors: this.errors.length !== 0 ? this.errors : null,
      searchInput: this.searchInput,
      releaseTime: this.releaseTime,
      page: this.page,
      pathwayView: this.pathwayView,
      pathwayStatus: this.pathwayStatus,
      sortField: this.sortField,
      sortDirection: this.sortDirection,
      prisonerCountMetrics: this.prisonerCountMetrics,
      reportType: this.reportType,
      assessmentRequired: this.assessmentRequired,
    }
  }
}

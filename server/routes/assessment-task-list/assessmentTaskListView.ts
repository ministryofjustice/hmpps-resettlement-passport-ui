import View, { ErrorMessage } from '../view'
import { PrisonerData } from '../../@types/express'
import { AssessmentsSummary } from '../../data/model/assessmentStatus'
import { AssessmentType } from '../../data/model/assessmentInformation'

export default class AssessmentTaskListView implements View {
  constructor(
    private readonly prisonerData: PrisonerData,
    private readonly assessmentsSummary: AssessmentsSummary,
    private readonly immediateNeedsReportCompleted: boolean,
    private readonly assessmentType: AssessmentType,
    private readonly errors: ErrorMessage[] = [],
  ) {
    // no op
  }

  get renderArgs(): {
    prisonerData: PrisonerData
    assessmentsSummary: AssessmentsSummary
    immediateNeedsReportCompleted: boolean
    assessmentType: AssessmentType
    errors: ErrorMessage[]
  } {
    return {
      prisonerData: this.prisonerData,
      assessmentsSummary: this.assessmentsSummary,
      immediateNeedsReportCompleted: this.immediateNeedsReportCompleted,
      assessmentType: this.assessmentType,
      errors: this.errors.length !== 0 ? this.errors : null,
    }
  }
}

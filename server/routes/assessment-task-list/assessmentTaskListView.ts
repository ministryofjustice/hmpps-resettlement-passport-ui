import View, { ErrorMessage } from '../view'
import { PrisonerData } from '../../@types/express'
import { AssessmentsSummary } from '../../data/model/assessmentStatus'

export default class AssessmentTaskListView implements View {
  constructor(
    private readonly prisonerData: PrisonerData,
    private readonly assessmentsSummary: AssessmentsSummary,
    private readonly BCST2Completed: boolean,
    private readonly errors: ErrorMessage[] = [],
  ) {}

  get renderArgs(): {
    prisonerData: PrisonerData
    assessmentsSummary: AssessmentsSummary
    BCST2Completed: boolean
    errors: ErrorMessage[]
  } {
    return {
      prisonerData: this.prisonerData,
      assessmentsSummary: this.assessmentsSummary,
      BCST2Completed: this.BCST2Completed,
      errors: this.errors.length !== 0 ? this.errors : null,
    }
  }
}

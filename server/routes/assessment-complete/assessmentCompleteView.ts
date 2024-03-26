import View, { ErrorMessage } from '../view'
import { PrisonerData } from '../../@types/express'
import { AssessmentType } from '../../data/model/assessmentInformation'

export default class AssessmentCompleteView implements View {
  constructor(
    private readonly prisonerData: PrisonerData,
    private readonly assessmentType: AssessmentType,
    private readonly errors: ErrorMessage[] = [],
  ) {}

  get renderArgs(): {
    prisonerData: PrisonerData
    assessmentType: AssessmentType
    errors: ErrorMessage[]
  } {
    return {
      prisonerData: this.prisonerData,
      assessmentType: this.assessmentType,
      errors: this.errors.length !== 0 ? this.errors : null,
    }
  }
}

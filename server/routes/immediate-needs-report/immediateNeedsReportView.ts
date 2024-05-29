import View, { ErrorMessage } from '../view'
import { PrisonerData } from '../../@types/express'
import { AssessmentPage, SubmittedInput, ValidationErrors } from '../../data/model/immediateNeedsReport'
import { AssessmentType } from '../../data/model/assessmentInformation'

export default class ImmediateNeedsReportView implements View {
  constructor(
    private readonly prisonerData: PrisonerData,
    private readonly assessmentPage: AssessmentPage,
    private readonly pathway: string,
    private readonly allQuestionsAndAnswers: SubmittedInput,
    private readonly validationErrors: ValidationErrors,
    private readonly edit: boolean,
    private readonly submitted: boolean,
    private readonly backButton: boolean,
    private readonly assessmentType: AssessmentType,
    private readonly errors: ErrorMessage[] = [],
  ) {
    // no op
  }

  get renderArgs(): {
    prisonerData: PrisonerData
    assessmentPage: AssessmentPage
    pathway: string
    allQuestionsAndAnswers: SubmittedInput
    validationErrors: ValidationErrors
    edit: boolean
    submitted: boolean
    backButton: boolean
    assessmentType: AssessmentType
    errors: ErrorMessage[]
  } {
    return {
      prisonerData: this.prisonerData,
      assessmentPage: this.assessmentPage,
      pathway: this.pathway,
      allQuestionsAndAnswers: this.allQuestionsAndAnswers,
      validationErrors: this.validationErrors,
      edit: this.edit,
      submitted: this.submitted,
      backButton: this.backButton,
      assessmentType: this.assessmentType,
      errors: this.errors.length !== 0 ? this.errors : null,
    }
  }
}

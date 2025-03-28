import View, { ErrorMessage } from '../view'
import { PrisonerData } from '../../@types/express'
import { ApiAssessmentPage, CachedAssessment, ValidationErrors } from '../../data/model/immediateNeedsReport'
import { AssessmentType } from '../../data/model/assessmentInformation'

export default class ImmediateNeedsReportView implements View {
  constructor(
    private readonly prisonerData: PrisonerData,
    private readonly assessmentPage: ApiAssessmentPage,
    private readonly pathway: string,
    private readonly allQuestionsAndAnswers: CachedAssessment,
    private readonly validationErrors: ValidationErrors,
    private readonly edit: boolean,
    private readonly submitted: boolean,
    private readonly backButton: boolean,
    private readonly assessmentType: AssessmentType,
    private readonly redirectAsInvalid: boolean,
    private readonly errors: ErrorMessage[] = [],
  ) {
    // no op
  }

  get renderArgs(): {
    prisonerData: PrisonerData
    assessmentPage: ApiAssessmentPage
    pathway: string
    allQuestionsAndAnswers: CachedAssessment
    validationErrors: ValidationErrors
    edit: boolean
    submitted: boolean
    backButton: boolean
    assessmentType: AssessmentType
    redirectAsInvalid: boolean
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
      redirectAsInvalid: this.redirectAsInvalid,
      errors: this.errors.length !== 0 ? this.errors : null,
    }
  }
}

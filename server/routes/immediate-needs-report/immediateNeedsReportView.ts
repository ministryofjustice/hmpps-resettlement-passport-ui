import View, { ErrorMessage } from '../view'
import { PrisonerData } from '../../@types/express'
import { ApiAssessmentPage, CachedQuestionAndAnswer, ValidationErrors } from '../../data/model/immediateNeedsReport'
import { AssessmentType } from '../../data/model/assessmentInformation'

export default class ImmediateNeedsReportView implements View {
  constructor(
    private readonly prisonerData: PrisonerData,
    private readonly assessmentPage: ApiAssessmentPage,
    private readonly pathway: string,
    private readonly allQuestionsAndAnswers: CachedQuestionAndAnswer[],
    private readonly validationErrors: ValidationErrors,
    private readonly assessmentType: AssessmentType,
    private readonly redirectAsInvalid: boolean,
  ) {
    // no op
  }

  get renderArgs(): {
    prisonerData: PrisonerData
    assessmentPage: ApiAssessmentPage
    pathway: string
    allQuestionsAndAnswers: CachedQuestionAndAnswer[]
    validationErrors: ValidationErrors
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
      assessmentType: this.assessmentType,
      redirectAsInvalid: this.redirectAsInvalid,
      errors: null,
    }
  }
}

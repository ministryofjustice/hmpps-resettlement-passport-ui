import View, { ErrorMessage } from '../view'
import { PrisonerData } from '../../@types/express'
import { ApiAssessmentPage, CachedQuestionAndAnswer, ValidationErrors } from '../../data/model/immediateNeedsReport'
import { AssessmentType } from '../../data/model/assessmentInformation'

export default class ImmediateNeedsReportCheckYourAnswersView implements View {
  constructor(
    private readonly prisonerData: PrisonerData,
    private readonly pathway: string,
    private readonly allQuestionsAndAnswers: CachedQuestionAndAnswer[],
    private readonly showDeclaration: boolean,
    private readonly declarationValidationError: boolean,
    private readonly assessmentType: AssessmentType,
  ) {
    // no op
  }

  get renderArgs(): {
    prisonerData: PrisonerData
    pathway: string
    allQuestionsAndAnswers: CachedQuestionAndAnswer[]
    showDeclaration: boolean
    declarationValidationError: boolean
    assessmentType: AssessmentType
    errors: ErrorMessage[]
  } {
    return {
      prisonerData: this.prisonerData,
      pathway: this.pathway,
      allQuestionsAndAnswers: this.allQuestionsAndAnswers,
      showDeclaration: this.showDeclaration,
      declarationValidationError: this.declarationValidationError,
      assessmentType: this.assessmentType,
      errors: null,
    }
  }
}

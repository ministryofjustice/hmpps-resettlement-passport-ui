import View, { ErrorMessage } from '../view'
import { PrisonerData } from '../../@types/express'
import { AssessmentPage, SubmittedInput, ValidationErrors } from '../../data/model/BCST2Form'

export default class BCST2FormView implements View {
  constructor(
    private readonly prisonerData: PrisonerData,
    private readonly assessmentPage: AssessmentPage,
    private readonly pathway: string,
    private readonly allQuestionsAndAnswers: SubmittedInput,
    private readonly validationErrors: ValidationErrors,
    private readonly edit: boolean,
    private readonly submitted: boolean,
    private readonly backButton: boolean,
    private readonly errors: ErrorMessage[] = [],
  ) {}

  get renderArgs(): {
    prisonerData: PrisonerData
    assessmentPage: AssessmentPage
    pathway: string
    allQuestionsAndAnswers: SubmittedInput
    validationErrors: ValidationErrors
    edit: boolean
    submitted: boolean
    backButton: boolean
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
      errors: this.errors.length !== 0 ? this.errors : null,
    }
  }
}

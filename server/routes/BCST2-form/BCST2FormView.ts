import View, { ErrorMessage } from '../view'
import { PrisonerData } from '../../@types/express'
import { AssessmentPage, SubmittedInput } from '../../data/model/BCST2Form'

export default class BCST2FormView implements View {
  constructor(
    private readonly prisonerData: PrisonerData,
    private readonly assessmentPage: AssessmentPage,
    private readonly pathway: string,
    private readonly allQuestionsAndAnswers: SubmittedInput,
    private readonly edit: boolean,
    private readonly errors: ErrorMessage[] = [],
  ) {}

  get renderArgs(): {
    prisonerData: PrisonerData
    assessmentPage: AssessmentPage
    pathway: string
    allQuestionsAndAnswers: SubmittedInput
    edit: boolean
    errors: ErrorMessage[]
  } {
    return {
      prisonerData: this.prisonerData,
      assessmentPage: this.assessmentPage,
      pathway: this.pathway,
      allQuestionsAndAnswers: this.allQuestionsAndAnswers,
      edit: this.edit,
      errors: this.errors.length !== 0 ? this.errors : null,
    }
  }
}

import { AssessmentType } from './assessmentInformation'

export default class GetAssessmentRequest {
  prisonerNumber: string | unknown

  sessionId: string

  token: string

  pathway: string

  currentPageId: string

  assessmentType: AssessmentType

  editMode: boolean

  submitted: boolean

  backButton: boolean

  validationErrorsString: string

  validationErrors: string

  isBcst2AlreadySubmitted: boolean

  isResettlementPlanAlreadySubmitted: boolean

  constructor(validationErrorsString: string) {
    this.validationErrorsString = validationErrorsString ? JSON.parse(decodeURIComponent(validationErrorsString)) : null
  }
}

import View, { ErrorMessage } from '../view'
import { Pathway, PrisonerData } from '../../@types/express'

export default class StatusUpdateView implements View {
  constructor(
    private readonly prisonerData: PrisonerData,
    private readonly selectedPathway: string,
    private readonly validationError: string,
  ) {
    // no op
  }

  get renderArgs(): {
    prisonerData: PrisonerData
    selectedPathway: string
    validationError: string
    errors: ErrorMessage[]
  } {
    return {
      prisonerData: this.prisonerData,
      selectedPathway: this.selectedPathway,
      validationError: this.validationError,
      errors: null,
    }
  }
}

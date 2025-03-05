import View, { ErrorMessage } from '../view'
import { PrisonerSupportNeedDetails } from '../../data/model/supportNeeds'
import { PrisonerData } from '../../@types/express'

export default class SupportNeedUpdateView implements View {
  constructor(
    private readonly prisonerData: PrisonerData,
    private readonly existingPrisonerNeed: PrisonerSupportNeedDetails,
    private readonly pathway: string,
    private readonly prisonerNeedId: string,
    private readonly releaseDate: string,
    private readonly errors: ErrorMessage[] = [],
  ) {
    // no op
  }

  get renderArgs(): {
    prisonerData: PrisonerData
    existingPrisonerNeed: PrisonerSupportNeedDetails
    pathway: string
    prisonerNeedId: string
    releaseDate: string
    errors: ErrorMessage[]
  } {
    return {
      prisonerData: this.prisonerData,
      existingPrisonerNeed: this.existingPrisonerNeed,
      pathway: this.pathway,
      prisonerNeedId: this.prisonerNeedId,
      releaseDate: this.releaseDate,
      errors: this.errors.length !== 0 ? this.errors : null,
    }
  }
}

import View, { ErrorMessage } from '../view'
import { PrisonerData } from '../../@types/express'
import { CrsReferralResponse } from '../../data/model/crsReferralResponse'

export default class AttitudesThinkingBehaviourView implements View {
  constructor(
    private readonly prisonerData: PrisonerData,
    private readonly BCST2Completed: boolean,
    private readonly crsReferrals: CrsReferralResponse,
    private readonly errors: ErrorMessage[] = [],
  ) {}

  get renderArgs(): {
    prisonerData: PrisonerData
    BCST2Completed: boolean
    crsReferrals: CrsReferralResponse
    errors: ErrorMessage[]
  } {
    return {
      prisonerData: this.prisonerData,
      BCST2Completed: this.BCST2Completed,
      crsReferrals: this.crsReferrals,
      errors: this.errors.length !== 0 ? this.errors : null,
    }
  }
}

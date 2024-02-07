import View, { ErrorMessage } from '../view'
import { PrisonerData } from '../../@types/express'
import { CrsReferralResponse } from '../../data/model/crsReferralResponse'

export default class FinanceIdView implements View {
  constructor(
    private readonly prisonerData: PrisonerData,
    private readonly BCST2Submitted: boolean,
    private readonly crsReferrals: CrsReferralResponse,
    private readonly errors: ErrorMessage[] = [],
  ) {}

  get renderArgs(): {
    prisonerData: PrisonerData
    BCST2Submitted: boolean
    crsReferrals: CrsReferralResponse
    errors: ErrorMessage[]
  } {
    return {
      prisonerData: this.prisonerData,
      BCST2Submitted: this.BCST2Submitted,
      crsReferrals: this.crsReferrals,
      errors: this.errors.length !== 0 ? this.errors : null,
    }
  }
}

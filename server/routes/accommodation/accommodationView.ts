import View, { ErrorMessage } from '../view'
import { PrisonerData } from '../../@types/express'
import { CrsReferralResponse } from '../../data/model/crsReferralResponse'
import { Accommodation } from '../../data/model/accommodation'

export default class AccommodationView implements View {
  constructor(
    private readonly prisonerData: PrisonerData,
    private readonly BCST2Submitted: boolean,
    private readonly crsReferrals: CrsReferralResponse,
    private readonly accommodation: Accommodation,
    private readonly errors: ErrorMessage[] = [],
  ) {}

  get renderArgs(): {
    prisonerData: PrisonerData
    BCST2Submitted: boolean
    crsReferrals: CrsReferralResponse
    accommodation: Accommodation
    errors: ErrorMessage[]
  } {
    return {
      prisonerData: this.prisonerData,
      BCST2Submitted: this.BCST2Submitted,
      crsReferrals: this.crsReferrals,
      accommodation: this.accommodation,
      errors: this.errors.length !== 0 ? this.errors : null,
    }
  }
}

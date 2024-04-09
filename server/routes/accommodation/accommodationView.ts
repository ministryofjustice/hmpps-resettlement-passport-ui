import View, { ErrorMessage } from '../view'
import { PrisonerData } from '../../@types/express'
import { CrsReferralResponse } from '../../data/model/crsReferralResponse'
import { Accommodation } from '../../data/model/accommodation'
import { AssessmentsInformation } from '../../data/model/assessmentInformation'

export default class AccommodationView implements View {
  constructor(
    private readonly prisonerData: PrisonerData,
    private readonly crsReferrals: CrsReferralResponse,
    private readonly accommodation: Accommodation,
    private readonly assessmentData: AssessmentsInformation,
    private readonly errors: ErrorMessage[] = [],
  ) {
    // no op
  }

  get renderArgs(): {
    prisonerData: PrisonerData
    crsReferrals: CrsReferralResponse
    accommodation: Accommodation
    assessmentData: AssessmentsInformation
    errors: ErrorMessage[]
  } {
    return {
      prisonerData: this.prisonerData,
      crsReferrals: this.crsReferrals,
      accommodation: this.accommodation,
      assessmentData: this.assessmentData,
      errors: this.errors.length !== 0 ? this.errors : null,
    }
  }
}

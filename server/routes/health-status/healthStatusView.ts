import View, { ErrorMessage } from '../view'
import { PrisonerData } from '../../@types/express'
import { CrsReferralResponse } from '../../data/model/crsReferralResponse'
import { AssessmentsInformation } from '../../data/model/assessmentInformation'

export default class HealthStatusView implements View {
  constructor(
    private readonly prisonerData: PrisonerData,
    private readonly crsReferrals: CrsReferralResponse,
    private readonly assessmentData: AssessmentsInformation,
    private readonly errors: ErrorMessage[] = [],
  ) {}

  get renderArgs(): {
    prisonerData: PrisonerData
    crsReferrals: CrsReferralResponse
    assessmentData: AssessmentsInformation
    errors: ErrorMessage[]
  } {
    return {
      prisonerData: this.prisonerData,
      crsReferrals: this.crsReferrals,
      assessmentData: this.assessmentData,
      errors: this.errors.length !== 0 ? this.errors : null,
    }
  }
}

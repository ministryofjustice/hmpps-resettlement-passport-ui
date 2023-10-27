import View, { ErrorMessage } from '../view'
import { PrisonerData } from '../../@types/express'
import { CrsReferralResponse } from '../../data/model/crsReferralResponse'

export default class EducationSkillsWorkView implements View {
  constructor(
    private readonly prisonerData: PrisonerData,
    private readonly crsReferrals: CrsReferralResponse,
    private readonly errors: ErrorMessage[] = [],
  ) {}

  get renderArgs(): {
    prisonerData: PrisonerData
    crsReferrals: CrsReferralResponse
    errors: ErrorMessage[]
  } {
    return {
      prisonerData: this.prisonerData,
      crsReferrals: this.crsReferrals,
      errors: this.errors.length !== 0 ? this.errors : null,
    }
  }
}

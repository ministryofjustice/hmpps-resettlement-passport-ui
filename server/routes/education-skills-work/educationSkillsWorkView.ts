import View, { ErrorMessage } from '../view'
import { PrisonerData } from '../../@types/express'
import { CrsReferralResponse } from '../../data/model/crsReferralResponse'
import { EducationSkillsWorkResponse } from '../../data/model/educationSkillsWorkResponse'

export default class EducationSkillsWorkView implements View {
  constructor(
    private readonly prisonerData: PrisonerData,
    private readonly BCST2Submitted: boolean,
    private readonly crsReferrals: CrsReferralResponse,
    private readonly educationSkillsWork: EducationSkillsWorkResponse,
    private readonly errors: ErrorMessage[] = [],
  ) {}

  get renderArgs(): {
    prisonerData: PrisonerData
    BCST2Submitted: boolean
    crsReferrals: CrsReferralResponse
    educationSkillsWork: EducationSkillsWorkResponse
    errors: ErrorMessage[]
  } {
    return {
      prisonerData: this.prisonerData,
      BCST2Submitted: this.BCST2Submitted,
      crsReferrals: this.crsReferrals,
      educationSkillsWork: this.educationSkillsWork,
      errors: this.errors.length !== 0 ? this.errors : null,
    }
  }
}

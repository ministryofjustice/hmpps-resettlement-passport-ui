import View, { ErrorMessage } from '../view'
import { PrisonerData } from '../../@types/express'
import { CrsReferralResponse } from '../../data/model/crsReferralResponse'
import { EducationSkillsWorkResponse } from '../../data/model/educationSkillsWorkResponse'
import { AssessmentsInformation } from '../../data/model/assessmentInformation'

export default class EducationSkillsWorkView implements View {
  constructor(
    private readonly prisonerData: PrisonerData,
    private readonly crsReferrals: CrsReferralResponse,
    private readonly educationSkillsWork: EducationSkillsWorkResponse,
    private readonly assessmentData: AssessmentsInformation,
    private readonly errors: ErrorMessage[] = [],
  ) {}

  get renderArgs(): {
    prisonerData: PrisonerData
    crsReferrals: CrsReferralResponse
    educationSkillsWork: EducationSkillsWorkResponse
    assessmentData: AssessmentsInformation
    errors: ErrorMessage[]
  } {
    return {
      prisonerData: this.prisonerData,
      crsReferrals: this.crsReferrals,
      educationSkillsWork: this.educationSkillsWork,
      assessmentData: this.assessmentData,
      errors: this.errors.length !== 0 ? this.errors : null,
    }
  }
}

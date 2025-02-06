import View, { ErrorMessage } from '../view'
import { PrisonerData } from '../../@types/express'
import { CrsReferralResponse } from '../../data/model/crsReferralResponse'
import { Accommodation } from '../../data/model/accommodation'
import { AssessmentsInformation } from '../../data/model/assessmentInformation'
import { CaseNotesHistory } from '../../data/model/caseNotesHistory'
import { CaseNotesCreators } from '../../data/model/caseNotesCreators'
import { PathwaySupportNeedsSummary, PathwaySupportNeedsUpdates } from '../../data/model/supportNeeds'

export default class AccommodationView implements View {
  constructor(
    private readonly prisonerData: PrisonerData,
    private readonly crsReferrals: CrsReferralResponse,
    private readonly accommodation: Accommodation,
    private readonly assessmentData: AssessmentsInformation,
    private readonly caseNotesData: CaseNotesHistory,
    private readonly caseNotesCreators: CaseNotesCreators,
    private readonly createdByUserId: string,
    private readonly pageSize: string,
    private readonly page: string,
    private readonly sort: string,
    private readonly days: string,
    private readonly pathwaySupportNeedsSummary: PathwaySupportNeedsSummary,
    private readonly supportNeedsUpdates: PathwaySupportNeedsUpdates,
    private readonly errors: ErrorMessage[] = [],
  ) {
    // no op
  }

  get renderArgs(): {
    prisonerData: PrisonerData
    crsReferrals: CrsReferralResponse
    accommodation: Accommodation
    assessmentData: AssessmentsInformation
    caseNotesData: CaseNotesHistory
    caseNotesCreators: CaseNotesCreators
    createdByUserId: string
    pageSize: string
    page: string
    sort: string
    days: string
    pathwaySupportNeedsSummary: PathwaySupportNeedsSummary
    supportNeedsUpdates: PathwaySupportNeedsUpdates
    errors: ErrorMessage[]
  } {
    return {
      prisonerData: this.prisonerData,
      crsReferrals: this.crsReferrals,
      accommodation: this.accommodation,
      assessmentData: this.assessmentData,
      caseNotesData: this.caseNotesData,
      caseNotesCreators: this.caseNotesCreators,
      createdByUserId: this.createdByUserId,
      pageSize: this.pageSize,
      page: this.page,
      sort: this.sort,
      days: this.days,
      pathwaySupportNeedsSummary: this.pathwaySupportNeedsSummary,
      supportNeedsUpdates: this.supportNeedsUpdates,
      errors: this.errors.length !== 0 ? this.errors : null,
    }
  }
}

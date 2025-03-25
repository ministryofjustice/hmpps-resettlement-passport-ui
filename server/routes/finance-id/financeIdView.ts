import View, { ErrorMessage } from '../view'
import { PrisonerData } from '../../@types/express'
import { CrsReferralResponse } from '../../data/model/crsReferralResponse'
import { AssessmentsInformation } from '../../data/model/assessmentInformation'
import { CaseNotesHistory } from '../../data/model/caseNotesHistory'
import { CaseNotesCreators } from '../../data/model/caseNotesCreators'
import { BankApplicationResponse, IdApplicationResponse } from '../../data/model/financeId'
import { PathwaySupportNeedsSummary, PathwaySupportNeedsUpdates } from '../../data/model/supportNeeds'

export default class FinanceIdView implements View {
  constructor(
    private readonly prisonerData: PrisonerData,
    private readonly crsReferrals: CrsReferralResponse,
    private readonly assessmentData: AssessmentsInformation,
    private readonly caseNotesData: CaseNotesHistory,
    private readonly caseNotesCreators: CaseNotesCreators,
    private readonly createdByUserId: string,
    private readonly pageSize: string,
    private readonly page: string,
    private readonly sort: string,
    private readonly days: string,
    private readonly finance: BankApplicationResponse,
    private readonly id: IdApplicationResponse,
    private readonly pathwaySupportNeedsSummary: PathwaySupportNeedsSummary,
    private readonly supportNeedsUpdates: PathwaySupportNeedsUpdates,
    private readonly supportNeedUpdateSort: string,
    private readonly supportNeedUpdateFilter: string,
    private readonly errors: ErrorMessage[] = [],
  ) {
    // no op
  }

  get renderArgs(): {
    prisonerData: PrisonerData
    crsReferrals: CrsReferralResponse
    assessmentData: AssessmentsInformation
    caseNotesData: CaseNotesHistory
    caseNotesCreators: CaseNotesCreators
    createdByUserId: string
    pageSize: string
    page: string
    sort: string
    days: string
    finance: BankApplicationResponse
    id: IdApplicationResponse
    pathwaySupportNeedsSummary: PathwaySupportNeedsSummary
    supportNeedsUpdates: PathwaySupportNeedsUpdates
    supportNeedUpdateSort: string
    supportNeedUpdateFilter: string
    errors: ErrorMessage[]
  } {
    return {
      prisonerData: this.prisonerData,
      crsReferrals: this.crsReferrals,
      assessmentData: this.assessmentData,
      caseNotesData: this.caseNotesData,
      caseNotesCreators: this.caseNotesCreators,
      createdByUserId: this.createdByUserId,
      pageSize: this.pageSize,
      page: this.page,
      sort: this.sort,
      days: this.days,
      finance: this.finance,
      id: this.id,
      pathwaySupportNeedsSummary: this.pathwaySupportNeedsSummary,
      supportNeedsUpdates: this.supportNeedsUpdates,
      supportNeedUpdateSort: this.supportNeedUpdateSort,
      supportNeedUpdateFilter: this.supportNeedUpdateFilter,
      errors: this.errors.length !== 0 ? this.errors : null,
    }
  }
}

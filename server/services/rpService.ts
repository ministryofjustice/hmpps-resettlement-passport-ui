import { RPClient } from '../data'
import { PrisonersList } from '../data/model/prisoners'
import { CrsReferralResponse } from '../data/model/crsReferralResponse'
import { EducationSkillsWorkResponse } from '../data/model/educationSkillsWorkResponse'
import logger from '../../logger'
import { ERROR_DICTIONARY, FEATURE_FLAGS } from '../utils/constants'
import { Accommodation } from '../data/model/accommodation'
import {
  ApiAssessmentPage,
  CachedAssessment,
  NextPage,
  ResettlementAssessmentVersion,
} from '../data/model/immediateNeedsReport'
import { AssessmentsSummary, AssessmentStatus } from '../data/model/assessmentStatus'
import { AssessmentsInformation, AssessmentSkipRequest, AssessmentType } from '../data/model/assessmentInformation'
import { Appointments } from '../data/model/appointment'
import { OtpDetails } from '../data/model/otp'
import { CaseNote, CaseNotesHistory } from '../data/model/caseNotesHistory'
import { CaseNotesCreator, CaseNotesCreators } from '../data/model/caseNotesCreators'
import { PrisonerData } from '../@types/express'
import { currentUser } from '../middleware/userContextMiddleware'
import { getFeatureFlagBoolean } from '../utils/utils'
import { ResetReason } from '../data/model/resetProfile'
import { BankApplicationResponse, IdApplication, IdApplicationResponse } from '../data/model/financeId'
import { ResettlementWorker } from '../data/model/resettlementWorkers'
import {
  CaseAllocationRequestBody,
  CaseAllocationResponseItem,
  CaseAllocationUnassignRequestBody,
} from '../data/model/caseAllocation'
import { WorkerList } from '../data/model/resettlementWorker'
import {
  PathwaySupportNeeds,
  PathwaySupportNeedsSummary,
  PathwaySupportNeedsUpdates,
  PrisonerSupportNeedDetails,
  PrisonerSupportNeedsPatch,
  SupportNeedsSummary,
} from '../data/model/supportNeeds'

export default class RpService {
  constructor() {
    // noop
  }

  async getListOfPrisoners(
    prisonSelected: string,
    page: number,
    pageSize: number,
    sortField: string,
    sortDirection: string,
    searchInput: string,
    releaseTime: string,
    pathwayView: string,
    pathwayStatus: string,
    assessmentRequired: string,
    watchList: string,
    includePastReleaseDates: boolean,
    workerId: string = '',
  ) {
    // If pathwayView is set then set assessmentRequired to blank
    const assessmentRequiredValue = !pathwayView ? assessmentRequired : ''

    return this.createClient().get<PrisonersList>(
      `/resettlement-passport/prison/${prisonSelected}/prisoners?page=${page}&size=${pageSize}&sort=${sortField},${sortDirection}&term=${searchInput}&days=${releaseTime}&pathwayView=${pathwayView}&pathwayStatus=${pathwayStatus}&assessmentRequired=${assessmentRequiredValue}&watchList=${watchList}&includePastReleaseDates=${includePastReleaseDates}&workerId=${workerId}`,
    )
  }

  async getListOfPrisonerCases(
    prisonSelected: string,
    includePastReleaseDates: boolean,
    page: number,
    pageSize: number,
    sortField: string,
    sortDirection: string,
  ) {
    return this.createClient().get<PrisonersList>(
      `/resettlement-passport/prison/${prisonSelected}/prisoners?page=${page}&size=${pageSize}&includePastReleaseDates=${includePastReleaseDates}&sort=${sortField},${sortDirection}`,
    )
  }

  async getAvailableResettlementWorkers(prisonId: string): Promise<ResettlementWorker[]> {
    return this.createClient().get<ResettlementWorker[]>(`/resettlement-passport/workers?prisonId=${prisonId}`)
  }

  createClient() {
    const { token, sessionId, userId } = currentUser()
    return new RPClient(token, sessionId, userId)
  }

  async getCrsReferrals(prisonerId: string, pathway: string) {
    let crsReferrals: CrsReferralResponse
    const client = this.createClient()
    try {
      crsReferrals = (await client.get(
        `/resettlement-passport/prisoner/${prisonerId}/crs-referrals/${pathway}`,
      )) as CrsReferralResponse
    } catch (err) {
      logger.warn(
        `Session: ${client.sessionId} Cannot retrieve ${pathway} CRS info for ${prisonerId} ${err.status} ${err}`,
      )
      if (err.status === 404) {
        crsReferrals = { results: [{ pathway, referrals: [], message: ERROR_DICTIONARY.DATA_NOT_FOUND }] }
      } else {
        crsReferrals = { error: ERROR_DICTIONARY.DATA_UNAVAILABLE }
      }
    }

    return crsReferrals
  }

  async getAssessmentInformation(prisonerId: string, pathway: string) {
    let assessmentInformation: AssessmentsInformation
    const client = this.createClient()
    try {
      assessmentInformation = (await client.get(
        `/resettlement-passport/prisoner/${prisonerId}/resettlement-assessment/${pathway}/latest`,
      )) as AssessmentsInformation
    } catch (err) {
      logger.warn(
        `Session: ${client.sessionId} Cannot retrieve ${pathway} CRS info for ${prisonerId} ${err.status} ${err}`,
      )
      if (err.status === 404) {
        assessmentInformation = { message: 'No report information available' }
      } else {
        assessmentInformation = { error: ERROR_DICTIONARY.DATA_UNAVAILABLE }
      }
    }

    return assessmentInformation
  }

  async getAccommodation(prisonerId: string) {
    let accommodation
    const client = this.createClient()
    try {
      accommodation = (await client.get(
        `/resettlement-passport/prisoner/${prisonerId}/accommodation`,
      )) as Promise<Accommodation>
    } catch (err) {
      logger.warn(
        `Session: ${client.sessionId} Cannot retrieve accommodation info for ${prisonerId} ${err.status} ${err}`,
      )
      if (err.status === 404) {
        accommodation = { error: ERROR_DICTIONARY.DATA_NOT_FOUND }
      } else {
        accommodation = { error: ERROR_DICTIONARY.DATA_UNAVAILABLE }
      }
    }

    return accommodation
  }

  async getEducationSkillsWork(prisonerId: string) {
    let getEducationSkillsWork: EducationSkillsWorkResponse
    const client = this.createClient()
    try {
      getEducationSkillsWork = (await client.get(
        `/resettlement-passport/prisoner/${prisonerId}/work-readiness`,
      )) as EducationSkillsWorkResponse
    } catch (err) {
      logger.warn(
        `Session: ${client.sessionId} Cannot retrieve Education, Skills & Work information for ${prisonerId} ${err.status} ${err}`,
      )
      if (err.status === 404) {
        getEducationSkillsWork = { error: ERROR_DICTIONARY.DATA_NOT_FOUND }
      } else {
        getEducationSkillsWork = { error: ERROR_DICTIONARY.DATA_UNAVAILABLE }
      }
    }

    return getEducationSkillsWork
  }

  async getAssessmentPage(
    prisonerId: string,
    pathway: string,
    pageId: string,
    assessmentType: AssessmentType,
    version: number,
  ) {
    let assessmentPage
    const client = this.createClient()
    try {
      assessmentPage = (await client.get(
        `/resettlement-passport/prisoner/${prisonerId}/resettlement-assessment/${pathway}/page/${pageId}?assessmentType=${assessmentType}&version=${version}`,
      )) as ApiAssessmentPage
    } catch (err) {
      logger.warn(
        `Session: ${client.sessionId} Cannot retrieve assessments summary for ${prisonerId} ${err.status} ${err}`,
      )
      if (err.status === 404) {
        assessmentPage = { error: ERROR_DICTIONARY.DATA_NOT_FOUND }
      } else {
        assessmentPage = { error: ERROR_DICTIONARY.DATA_UNAVAILABLE }
      }
    }

    return assessmentPage
  }

  async fetchNextPage(
    prisonerId: string,
    pathway: string,
    questionsAndAnswers: CachedAssessment,
    currentPageId: string,
    assessmentType: AssessmentType,
    version: number,
  ) {
    let nextQuestion
    const client = this.createClient()
    try {
      nextQuestion = (await client.post(
        `/resettlement-passport/prisoner/${prisonerId}/resettlement-assessment/${pathway}/next-page?version=${version}&assessmentType=${assessmentType}${
          currentPageId ? `&currentPage=${currentPageId}` : ''
        }`,
        questionsAndAnswers,
      )) as NextPage
    } catch (err) {
      logger.warn(
        `Session: ${client.sessionId} Cannot retrieve assessments summary for ${prisonerId} ${err.status} ${err}`,
      )
      if (err.status === 404) {
        nextQuestion = { error: ERROR_DICTIONARY.DATA_NOT_FOUND }
      } else {
        nextQuestion = { error: ERROR_DICTIONARY.DATA_UNAVAILABLE }
      }
    }

    return nextQuestion
  }

  async completeAssessment(
    prisonerId: string,
    pathway: string,
    questionsAndAnswers: CachedAssessment,
    assessmentType: AssessmentType,
  ) {
    let response
    const client = this.createClient()
    try {
      response = await client.post(
        `/resettlement-passport/prisoner/${prisonerId}/resettlement-assessment/${pathway}/complete?assessmentType=${assessmentType}`,
        questionsAndAnswers,
      )
    } catch (err) {
      logger.warn(
        `Session: ${client.sessionId} Cannot complete assessment for ${prisonerId} pathway ${pathway} ${err.status} ${err}`,
      )
      if (err.status === 404) {
        response = { error: ERROR_DICTIONARY.DATA_NOT_FOUND }
      } else {
        response = { error: ERROR_DICTIONARY.DATA_UNAVAILABLE }
      }
    }

    return response
  }

  async validateAssessment(
    prisonerId: string,
    pathway: string,
    assessment: CachedAssessment,
    assessmentType: AssessmentType,
  ) {
    let response: { valid?: boolean; error?: string }
    const client = this.createClient()
    try {
      await client.post(
        `/resettlement-passport/prisoner/${prisonerId}/resettlement-assessment/${pathway}/validate?assessmentType=${assessmentType}`,
        assessment,
      )
      response = { valid: true }
    } catch (err) {
      logger.warn(
        `Session: ${client.sessionId} Cannot validate assessment for ${prisonerId} pathway ${pathway} ${err.status} ${err}`,
      )
      if (err.status === 400) {
        response = { valid: false }
      } else {
        response = { error: ERROR_DICTIONARY.DATA_UNAVAILABLE }
      }
    }
    return response
  }

  async submitAssessment(prisonerId: string, assessmentType: AssessmentType) {
    let response: { error?: boolean }
    const useNewDeliusCaseNoteFormat = await getFeatureFlagBoolean(FEATURE_FLAGS.USE_NEW_DELIUS_CASE_NOTE_FORMAT)
    const useNewDpsCaseNoteFormat = await getFeatureFlagBoolean(FEATURE_FLAGS.USE_NEW_DPS_CASE_NOTE_FORMAT)
    const supportNeedsLegacyProfileParam = (await getFeatureFlagBoolean(FEATURE_FLAGS.SUPPORT_NEEDS))
      ? '&supportNeedsLegacyProfile=false'
      : ''
    const client = this.createClient()
    try {
      response = await client.post(
        `/resettlement-passport/prisoner/${prisonerId}/resettlement-assessment/submit?assessmentType=${assessmentType}&useNewDeliusCaseNoteFormat=${useNewDeliusCaseNoteFormat}&useNewDpsCaseNoteFormat=${useNewDpsCaseNoteFormat}${supportNeedsLegacyProfileParam}`,
        null,
      )
    } catch (err) {
      logger.warn(`Session: ${client.sessionId} Cannot submit assessments for ${prisonerId} ${err.status} ${err}`)
      response = { error: true }
    }

    return response
  }

  async getAssessmentSummary(prisonerId: string, type: AssessmentType): Promise<AssessmentsSummary> {
    let assessmentsSummary: AssessmentsSummary
    const client = this.createClient()

    try {
      const assessmentsSummaryResponse = (await client.get(
        `/resettlement-passport/prisoner/${prisonerId}/resettlement-assessment/summary?assessmentType=${type}`,
      )) as AssessmentStatus[]
      assessmentsSummary = { results: assessmentsSummaryResponse }
    } catch (err) {
      logger.warn(
        `Session: ${client.sessionId} Cannot retrieve assessments summary for ${prisonerId} ${err.status} ${err}`,
      )
      assessmentsSummary = { error: ERROR_DICTIONARY.DATA_UNAVAILABLE }
    }

    return assessmentsSummary
  }

  async getAppointments(prisonerId: string) {
    const client = this.createClient()
    try {
      return (await client.get(
        `/resettlement-passport/prisoner/${prisonerId}/appointments?futureOnly=true`,
      )) as Promise<Appointments>
    } catch (err) {
      logger.warn(
        `Session: ${client.sessionId} Cannot retrieve appointments info for ${prisonerId} ${err.status} ${err}`,
      )
      if (err.status === 404) {
        return { error: ERROR_DICTIONARY.DATA_NOT_FOUND, results: [] }
      }
      return { error: ERROR_DICTIONARY.DATA_UNAVAILABLE, results: [] }
    }
  }

  async getOtp(prisonerId: string) {
    const client = this.createClient()
    try {
      return (await client.get(`/resettlement-passport/popUser/${prisonerId}/otp`)) as Promise<OtpDetails>
    } catch (err) {
      logger.warn(`Session: ${client.sessionId} Cannot get otp for ${prisonerId} ${err.status} ${err}`)
      return this.recreateOtp(prisonerId, client)
    }
  }

  async recreateOtp(prisonerId: string, client: RPClient = this.createClient()) {
    try {
      return (await client.post(`/resettlement-passport/popUser/${prisonerId}/otp`, {})) as Promise<OtpDetails>
    } catch (err) {
      logger.warn(`Session: ${client.sessionId} Cannot recreate otp for ${prisonerId} ${err.status} ${err}`)
      return null
    }
  }

  async postBankApplication(prisonerNumber: string, body: Record<never, never>) {
    return this.createClient().post(`/resettlement-passport/prisoner/${prisonerNumber}/bankapplication`, body)
  }

  async postIdApplication(prisonerNumber: string, body: Record<never, never>) {
    return this.createClient().post(`/resettlement-passport/prisoner/${prisonerNumber}/idapplication`, body)
  }

  async patchBankApplication(prisonerNumber: string, applicationId: string, body: Record<never, never>) {
    return this.createClient().patch(
      `/resettlement-passport/prisoner/${prisonerNumber}/bankapplication/${applicationId}`,
      body,
    )
  }

  async patchIdApplication(prisonerNumber: string, applicationId: string, body: Record<never, never>) {
    return this.createClient().patch(
      `/resettlement-passport/prisoner/${prisonerNumber}/idapplication/${applicationId}`,
      body,
    )
  }

  async fetchFinance(prisonerNumber: string) {
    return (await this.createClient().get(
      `/resettlement-passport/prisoner/${prisonerNumber}/bankapplication`,
    )) as BankApplicationResponse
  }

  async deleteFinance(prisonerNumber: string, financeId: string) {
    return this.createClient().delete(`/resettlement-passport/prisoner/${prisonerNumber}/bankapplication/${financeId}`)
  }

  async fetchId(prisonerNumber: string) {
    const idResponse = (await this.createClient().get(
      `/resettlement-passport/prisoner/${prisonerNumber}/idapplication/all`,
    )) as IdApplication[]
    return { results: idResponse } as IdApplicationResponse
  }

  async deleteId(prisonerNumber: string, idId: string) {
    return this.createClient().delete(`/resettlement-passport/prisoner/${prisonerNumber}/idapplication/${idId}`)
  }

  async getCaseNotesHistory(
    prisonerId: string,
    pathway: string,
    createdByUserId: string,
    size: string,
    page: string,
    sort: string,
    days: string,
  ) {
    let caseNotes: CaseNotesHistory
    const rpClient = this.createClient()
    try {
      const caseNotesResponse = (await rpClient.get(
        `/resettlement-passport/case-notes/${prisonerId}?page=${page}&size=${size}&sort=${sort}&days=${days}&pathwayType=${pathway}&createdByUserId=${createdByUserId}`,
      )) as CaseNote
      caseNotes = { results: caseNotesResponse }
    } catch (err) {
      logger.warn(`Session: ${rpClient.sessionId} Cannot retrieve case notes for ${prisonerId} ${err.status} ${err}`)
      caseNotes = { error: ERROR_DICTIONARY.DATA_UNAVAILABLE }
    }

    return caseNotes
  }

  async getCaseNotesCreators(prisonerId: string, pathway: string) {
    let caseNotesCreators: CaseNotesCreators
    const rpClient = this.createClient()
    try {
      const caseNotesCreatorsResponse = (await rpClient.get(
        `/resettlement-passport/case-notes/${prisonerId}/creators/${pathway}`,
      )) as CaseNotesCreator[]
      caseNotesCreators = { results: caseNotesCreatorsResponse }
    } catch (err) {
      logger.warn(
        `Session: ${rpClient.sessionId} Cannot retrieve case notes creators for ${prisonerId} ${err.status} ${err}`,
      )
      caseNotesCreators = { error: ERROR_DICTIONARY.DATA_UNAVAILABLE }
    }

    return caseNotesCreators
  }

  async postAssessmentSkip(prisonerId: string, skipRequest: AssessmentSkipRequest): Promise<void> {
    await this.createClient().post(
      `/resettlement-passport/prisoner/${prisonerId}/resettlement-assessment/skip`,
      skipRequest,
    )
  }

  async patchStatusWithCaseNote(
    prisonerId: string,
    body: {
      pathway: string
      status: string
      caseNoteText: string
    },
  ) {
    await this.createClient().patch(`/resettlement-passport/prisoner/${prisonerId}/pathway-with-case-note`, body)
  }

  async getPrisonerDetails(prisonerId: string): Promise<PrisonerData> {
    return (await this.createClient().get(`/resettlement-passport/prisoner/${prisonerId}`)) as PrisonerData
  }

  async getPrisonerImage(prisonerNumber: string, facialImageId: string): Promise<string> {
    return this.createClient().getImageAsBase64String(
      `/resettlement-passport/prisoner/${prisonerNumber}/image/${facialImageId}`,
    )
  }

  async getLatestAssessmentVersion(prisonerNumber: string, assessmentType: string, pathway: string) {
    return (
      (await this.createClient().get(
        `/resettlement-passport/prisoner/${prisonerNumber}/resettlement-assessment/${pathway}/version?assessmentType=${assessmentType}`,
      )) as ResettlementAssessmentVersion
    ).version
  }

  async resetProfile(prisonerNumber: string, resetReason: ResetReason) {
    let response: { error: string }
    const client = this.createClient()
    try {
      await client.post(`/resettlement-passport/prisoner/${prisonerNumber}/reset-profile`, resetReason)
    } catch (err) {
      logger.warn(`Session: ${client.sessionId} Cannot reset profile for ${prisonerNumber} ${err.status} ${err}`)
      if (err.status !== 200) {
        response = { error: 'Something went wrong' }
      }
    }

    return response
  }

  async getLicenceConditionImage(prisonerNumber: string, licenceId: string, conditionId: string): Promise<string> {
    return this.createClient().getImageAsBase64String(
      `/resettlement-passport/prisoner/${prisonerNumber}/licence-condition/id/${licenceId}/condition/${conditionId}/image`,
    )
  }

  async postWatchlist(prisonerNumber: string): Promise<void> {
    await this.createClient().post(`/resettlement-passport/prisoner/${prisonerNumber}/watch`, null)
  }

  async deleteWatchlist(prisonerNumber: string): Promise<void> {
    await this.createClient().delete(`/resettlement-passport/prisoner/${prisonerNumber}/watch`)
  }

  getPrisonerOverviewPageData(
    prisonerNumber: string,
    page: string,
    size: string,
    sort: string,
    days: string,
    selectedPathway: string,
  ) {
    const rpClient = this.createClient()
    return [
      rpClient.get(`/resettlement-passport/prisoner/${prisonerNumber}/licence-condition`),
      rpClient.get(`/resettlement-passport/prisoner/${prisonerNumber}/risk/scores`),
      rpClient.get(`/resettlement-passport/prisoner/${prisonerNumber}/risk/rosh`),
      rpClient.get(`/resettlement-passport/prisoner/${prisonerNumber}/risk/mappa`),
      rpClient.get(
        `/resettlement-passport/case-notes/${prisonerNumber}?page=${page}&size=${size}&sort=${sort}&days=${days}&pathwayType=${selectedPathway}`,
      ),
      rpClient.get(`/resettlement-passport/prisoner/${prisonerNumber}/staff-contacts`),
      rpClient
        .get(`/resettlement-passport/prisoner/${prisonerNumber}/appointments`)
        .then((a: Appointments) => a.results),
    ]
  }

  async postCaseAllocations(caseAllocations: CaseAllocationRequestBody): Promise<CaseAllocationResponseItem[]> {
    return this.createClient().post(`/resettlement-passport/workers/cases`, caseAllocations)
  }

  async unassignCaseAllocations(caseAllocations: CaseAllocationUnassignRequestBody): Promise<void> {
    await this.createClient().patch(`/resettlement-passport/workers/cases`, caseAllocations)
  }

  async getAssignedWorkerList(prisonId: string) {
    return this.createClient().get<WorkerList>(`/resettlement-passport/workers/capacity?prisonId=${prisonId}`)
  }

  async getSupportNeedsSummary(prisonerNumber: string) {
    return this.createClient().get<SupportNeedsSummary>(
      `/resettlement-passport/prisoner/${prisonerNumber}/needs/summary`,
    )
  }

  async getPathwaySupportNeedsSummary(prisonerNumber: string, pathway: string) {
    return this.createClient().get<PathwaySupportNeedsSummary>(
      `/resettlement-passport/prisoner/${prisonerNumber}/needs/${pathway}/summary`,
    )
  }

  async getPathwayNeedsUpdates(
    prisonerNumber: string,
    pathway: string,
    page: number,
    size: number,
    sort: string,
    filterByPrisonerSupportNeedId: string,
  ) {
    return this.createClient().get<PathwaySupportNeedsUpdates>(
      `/resettlement-passport/prisoner/${prisonerNumber}/needs/${pathway}/updates?page=${page}&size=${size}&sort=${sort}&filterByPrisonerSupportNeedId=${filterByPrisonerSupportNeedId}`,
    )
  }

  async getPathwaySupportNeeds(prisonerNumber: string, pathway: string) {
    return this.createClient().get<PathwaySupportNeeds>(
      `/resettlement-passport/prisoner/${prisonerNumber}/needs/${pathway}`,
    )
  }

  async getPrisonerNeedById(prisonerNumber: string, prisonerNeedId: string) {
    return this.createClient().get<PrisonerSupportNeedDetails>(
      `/resettlement-passport/prisoner/${prisonerNumber}/prisoner-need/${prisonerNeedId}`,
    )
  }

  async patchSupportNeedById(
    prisonerNumber: string,
    prisonerNeedId: string,
    supportNeedsPatch: PrisonerSupportNeedsPatch,
  ) {
    await this.createClient().patch(
      `/resettlement-passport/prisoner/${prisonerNumber}/need/${prisonerNeedId}`,
      supportNeedsPatch,
    )
  }
}

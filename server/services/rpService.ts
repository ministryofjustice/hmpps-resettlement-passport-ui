import { RPClient } from '../data'
import { PrisonersList } from '../data/model/prisoners'
import { CrsReferralResponse } from '../data/model/crsReferralResponse'
import { EducationSkillsWorkResponse } from '../data/model/educationSkillsWorkResponse'
import logger from '../../logger'
import { ERROR_DICTIONARY } from '../utils/constants'
import { Accommodation } from '../data/model/accommodation'
import { PrisonerCountMetrics } from '../data/model/metrics'
import { AssessmentPage, NextPage, SubmittedInput } from '../data/model/BCST2Form'
import { AssessmentsSummary, AssessmentStatus } from '../data/model/assessmentStatus'
import { AssessmentsInformation, AssessmentSkipRequest, AssessmentType } from '../data/model/assessmentInformation'
import { Appointments } from '../data/model/appointment'
import { OtpDetails } from '../data/model/otp'
import { CaseNote, CaseNotesHistory } from '../data/model/caseNotesHistory'
import { CaseNotesCreator, CaseNotesCreators } from '../data/model/caseNotesCreators'

export default class RpService {
  constructor(private readonly rpClient: RPClient) {
    // noop
  }

  async getListOfPrisoners(
    token: string,
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
  ) {
    // If pathwayView is set then set assessmentRequired to blank
    const assessmentRequiredValue = !pathwayView ? assessmentRequired : ''
    await this.rpClient.setToken(token)
    return (await this.rpClient.get(
      `/resettlement-passport/prison/${prisonSelected}/prisoners?page=${page}&size=${pageSize}&sort=${sortField},${sortDirection}&term=${searchInput}&days=${releaseTime}&pathwayView=${pathwayView}&pathwayStatus=${pathwayStatus}&assessmentRequired=${assessmentRequiredValue}&watchList=${watchList}`,
    )) as Promise<PrisonersList>
  }

  async getCrsReferrals(token: string, sessionId: string, prisonerId: string, pathway: string) {
    await this.rpClient.setToken(token)

    let crsReferrals: CrsReferralResponse
    try {
      crsReferrals = (await this.rpClient.get(
        `/resettlement-passport/prisoner/${prisonerId}/crs-referrals/${pathway}`,
      )) as CrsReferralResponse
    } catch (err) {
      logger.warn(`Session: ${sessionId} Cannot retrieve ${pathway} CRS info for ${prisonerId} ${err.status} ${err}`)
      if (err.status === 404) {
        crsReferrals = { results: [{ pathway, referrals: [], message: ERROR_DICTIONARY.DATA_NOT_FOUND }] }
      } else {
        crsReferrals = { error: ERROR_DICTIONARY.DATA_UNAVAILABLE }
      }
    }

    return crsReferrals
  }

  async getAssessmentInformation(token: string, sessionId: string, prisonerId: string, pathway: string) {
    await this.rpClient.setToken(token)

    let assessmentInformation: AssessmentsInformation
    try {
      assessmentInformation = (await this.rpClient.get(
        `/resettlement-passport/prisoner/${prisonerId}/resettlement-assessment/${pathway}/latest`,
      )) as AssessmentsInformation
    } catch (err) {
      logger.warn(`Session: ${sessionId} Cannot retrieve ${pathway} CRS info for ${prisonerId} ${err.status} ${err}`)
      if (err.status === 404) {
        assessmentInformation = { error: ERROR_DICTIONARY.DATA_NOT_FOUND }
      } else {
        assessmentInformation = { error: ERROR_DICTIONARY.DATA_UNAVAILABLE }
      }
    }

    return assessmentInformation
  }

  async getAccommodation(token: string, sessionId: string, prisonerId: string) {
    await this.rpClient.setToken(token)

    let accommodation
    try {
      accommodation = (await this.rpClient.get(
        `/resettlement-passport/prisoner/${prisonerId}/accommodation`,
      )) as Promise<Accommodation>
    } catch (err) {
      logger.warn(`Session: ${sessionId} Cannot retrieve accommodation info for ${prisonerId} ${err.status} ${err}`)
      if (err.status === 404) {
        accommodation = { error: ERROR_DICTIONARY.DATA_NOT_FOUND }
      } else {
        accommodation = { error: ERROR_DICTIONARY.DATA_UNAVAILABLE }
      }
    }

    return accommodation
  }

  async getEducationSkillsWork(token: string, sessionId: string, prisonerId: string) {
    await this.rpClient.setToken(token)

    let getEducationSkillsWork: EducationSkillsWorkResponse
    try {
      getEducationSkillsWork = (await this.rpClient.get(
        `/resettlement-passport/prisoner/${prisonerId}/work-readiness`,
      )) as EducationSkillsWorkResponse
    } catch (err) {
      logger.warn(
        `Session: ${sessionId} Cannot retrieve Education, Skills & Work information for ${prisonerId} ${err.status} ${err}`,
      )
      if (err.status === 404) {
        getEducationSkillsWork = { error: ERROR_DICTIONARY.DATA_NOT_FOUND }
      } else {
        getEducationSkillsWork = { error: ERROR_DICTIONARY.DATA_UNAVAILABLE }
      }
    }

    return getEducationSkillsWork
  }

  async getPrisonerCountMetrics(token: string, sessionId: string, prisonId: string) {
    await this.rpClient.setToken(token)

    let prisonerCountMetrics: PrisonerCountMetrics
    try {
      prisonerCountMetrics = (await this.rpClient.get(
        `/resettlement-passport/metrics/prisoner-counts?prisonId=${prisonId}`,
      )) as PrisonerCountMetrics
    } catch (err) {
      logger.warn(`Session: ${sessionId} Cannot retrieve prisoner count metrics for ${prisonId} ${err.status} ${err}`)
      if (err.status === 404) {
        prisonerCountMetrics = { error: ERROR_DICTIONARY.DATA_NOT_FOUND }
      } else {
        prisonerCountMetrics = { error: ERROR_DICTIONARY.DATA_UNAVAILABLE }
      }
    }

    return prisonerCountMetrics
  }

  async getAssessmentPage(
    token: string,
    sessionId: string,
    prisonerId: string,
    pathway: string,
    pageId: string,
    assessmentType: AssessmentType,
  ) {
    await this.rpClient.setToken(token)

    let assessmentPage
    try {
      assessmentPage = (await this.rpClient.get(
        `/resettlement-passport/prisoner/${prisonerId}/resettlement-assessment/${pathway}/page/${pageId}?assessmentType=${assessmentType}`,
      )) as AssessmentPage
    } catch (err) {
      logger.warn(`Session: ${sessionId} Cannot retrieve assessments summary for ${prisonerId} ${err.status} ${err}`)
      if (err.status === 404) {
        assessmentPage = { error: ERROR_DICTIONARY.DATA_NOT_FOUND }
      } else {
        assessmentPage = { error: ERROR_DICTIONARY.DATA_UNAVAILABLE }
      }
    }

    return assessmentPage
  }

  async fetchNextPage(
    token: string,
    sessionId: string,
    prisonerId: string,
    pathway: string,
    questionsAndAnswers: SubmittedInput,
    currentPageId: string,
    assessmentType: AssessmentType,
  ) {
    await this.rpClient.setToken(token)
    let nextQuestion
    try {
      nextQuestion = (await this.rpClient.post(
        `/resettlement-passport/prisoner/${prisonerId}/resettlement-assessment/${pathway}/next-page?assessmentType=${assessmentType}${
          currentPageId ? `&currentPage=${currentPageId}` : ''
        }`,
        questionsAndAnswers,
      )) as NextPage
    } catch (err) {
      logger.warn(`Session: ${sessionId} Cannot retrieve assessments summary for ${prisonerId} ${err.status} ${err}`)
      if (err.status === 404) {
        nextQuestion = { error: ERROR_DICTIONARY.DATA_NOT_FOUND }
      } else {
        nextQuestion = { error: ERROR_DICTIONARY.DATA_UNAVAILABLE }
      }
    }

    return nextQuestion
  }

  async completeAssessment(
    token: string,
    sessionId: string,
    prisonerId: string,
    pathway: string,
    questionsAndAnswers: SubmittedInput,
    assessmentType: AssessmentType,
  ) {
    await this.rpClient.setToken(token)
    let response
    try {
      response = await this.rpClient.post(
        `/resettlement-passport/prisoner/${prisonerId}/resettlement-assessment/${pathway}/complete?assessmentType=${assessmentType}`,
        questionsAndAnswers,
      )
    } catch (err) {
      logger.warn(
        `Session: ${sessionId} Cannot complete assessment for ${prisonerId} pathway ${pathway} ${err.status} ${err}`,
      )
      if (err.status === 404) {
        response = { error: ERROR_DICTIONARY.DATA_NOT_FOUND }
      } else {
        response = { error: ERROR_DICTIONARY.DATA_UNAVAILABLE }
      }
    }

    return response
  }

  async submitAssessment(token: string, sessionId: string, prisonerId: string, assessmentType: AssessmentType) {
    await this.rpClient.setToken(token)
    let response: { error?: boolean }
    try {
      response = await this.rpClient.post(
        `/resettlement-passport/prisoner/${prisonerId}/resettlement-assessment/submit?assessmentType=${assessmentType}`,
        null,
      )
    } catch (err) {
      logger.warn(`Session: ${sessionId} Cannot submit assessments for ${prisonerId} ${err.status} ${err}`)
      response = { error: true }
    }

    return response
  }

  async getAssessmentSummary(
    token: string,
    sessionId: string,
    prisonerId: string,
    type: AssessmentType,
  ): Promise<AssessmentsSummary> {
    await this.rpClient.setToken(token)
    let assessmentsSummary: AssessmentsSummary

    try {
      const assessmentsSummaryResponse = (await this.rpClient.get(
        `/resettlement-passport/prisoner/${prisonerId}/resettlement-assessment/summary?assessmentType=${type}`,
      )) as AssessmentStatus[]
      assessmentsSummary = { results: assessmentsSummaryResponse }
    } catch (err) {
      logger.warn(`Session: ${sessionId} Cannot retrieve assessments summary for ${prisonerId} ${err.status} ${err}`)
      assessmentsSummary = { error: ERROR_DICTIONARY.DATA_UNAVAILABLE }
    }

    return assessmentsSummary
  }

  async getAppointments(token: string, sessionId: string, prisonerId: string) {
    await this.rpClient.setToken(token)

    try {
      return (await this.rpClient.get(
        `/resettlement-passport/prisoner/${prisonerId}/appointments?futureOnly=true`,
      )) as Promise<Appointments>
    } catch (err) {
      logger.warn(`Session: ${sessionId} Cannot retrieve appointments info for ${prisonerId} ${err.status} ${err}`)
      if (err.status === 404) {
        return { error: ERROR_DICTIONARY.DATA_NOT_FOUND, results: [] }
      }
      return { error: ERROR_DICTIONARY.DATA_UNAVAILABLE, results: [] }
    }
  }

  async getOtp(token: string, sessionId: string, prisonerId: string) {
    await this.rpClient.setToken(token)

    try {
      return (await this.rpClient.get(`/resettlement-passport/popUser/${prisonerId}/otp`)) as Promise<OtpDetails>
    } catch (err) {
      logger.warn(`Session: ${sessionId} Cannot get otp for ${prisonerId} ${err.status} ${err}`)
      return this.recreateOtp(token, sessionId, prisonerId)
    }
  }

  async recreateOtp(token: string, sessionId: string, prisonerId: string) {
    await this.rpClient.setToken(token)

    try {
      return (await this.rpClient.post(`/resettlement-passport/popUser/${prisonerId}/otp`, {})) as Promise<OtpDetails>
    } catch (err) {
      logger.warn(`Session: ${sessionId} Cannot recreate otp for ${prisonerId} ${err.status} ${err}`)
      return null
    }
  }

  async fetchAssessment(prisonerNumber: string) {
    return this.rpClient.get(`/resettlement-passport/prisoner/${prisonerNumber}/assessment`)
  }

  async postAssessment(prisonerNumber: string, body: Record<never, never>) {
    return this.rpClient.post(`/resettlement-passport/prisoner/${prisonerNumber}/assessment`, body)
  }

  async postBankApplication(prisonerNumber: string, body: Record<never, never>) {
    return this.rpClient.post(`/resettlement-passport/prisoner/${prisonerNumber}/bankapplication`, body)
  }

  async postIdApplication(prisonerNumber: string, body: Record<never, never>) {
    return this.rpClient.post(`/resettlement-passport/prisoner/${prisonerNumber}/idapplication`, body)
  }

  async patchBankApplication(prisonerNumber: string, applicationId: string, body: Record<never, never>) {
    return this.rpClient.patch(
      `/resettlement-passport/prisoner/${prisonerNumber}/bankapplication/${applicationId}`,
      body,
    )
  }

  async patchIdApplication(prisonerNumber: string, applicationId: string, body: Record<never, never>) {
    return this.rpClient.patch(`/resettlement-passport/prisoner/${prisonerNumber}/idapplication/${applicationId}`, body)
  }

  async deleteAssessment(prisonerNumber: string, assessmentId: string) {
    return this.rpClient.delete(`/resettlement-passport/prisoner/${prisonerNumber}/assessment/${assessmentId}`)
  }

  async fetchFinance(prisonerNumber: string) {
    return this.rpClient.get(`/resettlement-passport/prisoner/${prisonerNumber}/bankapplication`)
  }

  async deleteFinance(prisonerNumber: string, financeId: string) {
    return this.rpClient.delete(`/resettlement-passport/prisoner/${prisonerNumber}/bankapplication/${financeId}`)
  }

  async fetchId(prisonerNumber: string) {
    return this.rpClient.get(`/resettlement-passport/prisoner/${prisonerNumber}/idapplication/all`)
  }

  async deleteId(prisonerNumber: string, idId: string) {
    return this.rpClient.delete(`/resettlement-passport/prisoner/${prisonerNumber}/idapplication/${idId}`)
  }

  async getCaseNotesHistory(
    token: string,
    sessionId: string,
    prisonerId: string,
    pathway: string,
    createdByUserId: string,
    size: string,
    page: string,
    sort: string,
    days: string,
  ) {
    await this.rpClient.setToken(token)
    let caseNotes: CaseNotesHistory
    try {
      const caseNotesResponse = (await this.rpClient.get(
        `/resettlement-passport/case-notes/${prisonerId}?page=${page}&size=${size}&sort=${sort}&days=${days}&pathwayType=${pathway}&createdByUserId=${createdByUserId}`,
      )) as CaseNote[]
      caseNotes = { results: caseNotesResponse }
    } catch (err) {
      logger.warn(`Session: ${sessionId} Cannot retrieve case notes for ${prisonerId} ${err.status} ${err}`)
      caseNotes = { error: ERROR_DICTIONARY.DATA_UNAVAILABLE }
    }

    return caseNotes
  }

  async getCaseNotesCreators(token: string, sessionId: string, prisonerId: string, pathway: string) {
    await this.rpClient.setToken(token)
    let caseNotesCreators: CaseNotesCreators
    try {
      const caseNotesCreatorsResponse = (await this.rpClient.get(
        `/resettlement-passport/case-notes/${prisonerId}/creators/${pathway}`,
      )) as CaseNotesCreator[]
      caseNotesCreators = { results: caseNotesCreatorsResponse }
    } catch (err) {
      logger.warn(`Session: ${sessionId} Cannot retrieve case notes creators for ${prisonerId} ${err.status} ${err}`)
      caseNotesCreators = { error: ERROR_DICTIONARY.DATA_UNAVAILABLE }
    }

    return caseNotesCreators
  }

  async postAssessmentSkip(token: string, prisonerId: string, skipRequest: AssessmentSkipRequest): Promise<void> {
    await this.rpClient.setToken(token)
    await this.rpClient.post(`/resettlement-passport/prisoner/${prisonerId}/resettlement-assessment/skip`, skipRequest)
  }
}

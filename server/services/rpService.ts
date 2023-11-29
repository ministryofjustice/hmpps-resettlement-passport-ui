import { RPClient } from '../data'
import { PrisonersList } from '../data/model/prisoners'
import { CrsReferralResponse } from '../data/model/crsReferralResponse'
import { EducationSkillsWorkResponse } from '../data/model/educationSkillsWorkResponse'
import logger from '../../logger'
import { ERROR_DICTIONARY } from '../utils/constants'
import { Accommodation } from '../data/model/accommodation'

export default class RpService {
  constructor(private readonly rpClient: RPClient) {}

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
  ) {
    await this.rpClient.setToken(token)
    return (await this.rpClient.get(
      `/resettlement-passport/prison/${prisonSelected}/prisoners?page=${page}&size=${pageSize}&sort=${sortField},${sortDirection}&term=${searchInput}&days=${releaseTime}&pathwayView=${pathwayView}&pathwayStatus=${pathwayStatus}`,
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
}

import { RPClient } from '../data'
import { PrisonersList } from '../data/model/prisoners'
import { CrsReferralResponse } from '../data/model/crsReferralResponse'
import logger from '../../logger'
import { ERROR_DICTIONARY } from '../utils/constants'

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
  ) {
    await this.rpClient.setToken(token)
    return (await this.rpClient.get(
      `/resettlement-passport/prison/${prisonSelected}/prisoners?page=${page}&size=${pageSize}&sort=${sortField},${sortDirection}&term=${searchInput}&days=${releaseTime}`,
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
      logger.warn(
        `Session: ${sessionId} Cannot retrieve Drugs and alcohol CRS info for ${prisonerId} ${err.status} ${err}`,
      )
      if (err.status === 404) {
        crsReferrals = { error: ERROR_DICTIONARY.DATA_NOT_FOUND }
      } else {
        crsReferrals = { error: ERROR_DICTIONARY.DATA_UNAVAILABLE }
      }
    }

    return crsReferrals
  }
}

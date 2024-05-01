/* eslint-disable @typescript-eslint/no-explicit-any */
import RestClient from './restClient'
import config from '../config'

export interface UserActiveCaseLoad {
  caseLoadId: string
  description: string
}

export default class NomisUserRolesApiClient {
  restClient: RestClient

  constructor(token: string, sessionId = '', userId = '') {
    this.restClient = new RestClient('Nomis User Roles API', config.apis.nomisUserRolesClient, token, sessionId, userId)
  }

  async getUserActiveCaseLoad(): Promise<any> {
    return this.restClient.get<any>({ path: `/me/caseloads` })
  }
}

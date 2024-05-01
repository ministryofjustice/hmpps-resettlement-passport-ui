/* eslint-disable @typescript-eslint/no-explicit-any */
import RestClient from './restClient'
import config from '../config'

export interface User {
  name: string
  activeCaseLoadId: string
}

export default class ManageUsersApiClient {
  restClient: RestClient

  constructor(token: string, sessionId = '', userId = '') {
    this.restClient = new RestClient('Manage Users API', config.apis.manageUsersClient, token, sessionId, userId)
  }

  async getUser(): Promise<User> {
    return this.restClient.get<User>({ path: '/users/me' })
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import RestClient from './restClient'
import config from '../config'

interface UserCaseLoad {
  caseloads: [
    {
      id: string
      name: string
    },
  ]
}

export interface UserActiveCaseLoad {
  caseLoadId: string
  description: string
}

interface Role {
  roleCode: string
}

interface GetStaffDetailsResponse {
  staffId: number
  firstName: string
  lastName: string
  status: string
  primaryEmail?: string
  generalAccount: {
    username: string
    active: boolean
    accountType: string
    activeCaseload: {
      id: string
      name: string
    }
    caseloads: { id: string; name: string }[]
  }
}

export default class NomisUserRolesApiClient {
  restClient: RestClient

  constructor(token: string, sessionId = '', userId = '') {
    this.restClient = new RestClient('Nomis User Roles API', config.apis.nomisUserRolesClient, token, sessionId, userId)
  }

  async getUserCaseLoads(username: string): Promise<string[]> {
    return this.restClient
      .get<UserCaseLoad>({ path: `/users/${username}/caseloads` })
      .then(userCaseload => userCaseload.caseloads.map(caseload => caseload.id))
  }

  async getUserRoles(username: string): Promise<string[]> {
    return this.restClient
      .get<Role[]>({ path: `/users/${username}/roles` })
      .then(roles => roles.map(role => `ROLE_${role.roleCode}`))
  }

  async getUserActiveCaseLoad(): Promise<any> {
    return this.restClient.get<any>({ path: `/me/caseloads` })
  }

  async getStaffDetails(staffId: number): Promise<GetStaffDetailsResponse> {
    return this.restClient.get<GetStaffDetailsResponse>({ path: `/users/staff/${staffId}` })
  }
}

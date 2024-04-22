import { convertToTitleCase } from '../utils/utils'
import NomisUserRolesApiClient, { UserActiveCaseLoad } from '../data/nomisUserRolesApiClient'

export interface UserDetails {
  name: string
  displayName: string
  username: string
}

export default class UserService {
  constructor() {
    // no op
  }

  async getUser(token: string): Promise<UserDetails> {
    const user = await new NomisUserRolesApiClient(token).getUser()
    return { ...user, displayName: convertToTitleCase(user.name), username: user.name }
  }

  async getUserActiveCaseLoad(token: string): Promise<UserActiveCaseLoad> {
    const userActiveCaseLoad = await new NomisUserRolesApiClient(token).getUserActiveCaseLoad()
    return {
      caseLoadId: userActiveCaseLoad.activeCaseload.id,
      description: userActiveCaseLoad.activeCaseload.name,
    }
  }
}

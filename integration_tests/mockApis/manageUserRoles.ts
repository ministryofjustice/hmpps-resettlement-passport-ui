import { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'

export const stubManageUserRolesPing = (): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/manageUsersApi/health/ping',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: { status: 'UP' },
    },
  })

export default {
  stubManageUserRolesPing,
}

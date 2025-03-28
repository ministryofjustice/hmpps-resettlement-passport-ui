import { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'

export const stubFrontendComponentsPing = (): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/component/ping',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: { status: 'UP' },
    },
  })

export default {
  stubFrontendComponentsPing,
}

import { stubFor } from './wiremock'

const stubGetPrisoners = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPathPattern: '/rpApi/resettlement-passport/prison/1/prisoners',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {},
    },
  })

export default {
  stubGetPrisoners,
}

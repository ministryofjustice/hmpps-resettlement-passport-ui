import RestClient from './restClient'
import config from '../config'
import Prison from './model'

export default class RPClient {
  private static restClient(token: string): RestClient {
    return new RestClient('RP API Client', config.apis.rpClient, token)
  }

  async getPrisons(token: string): Promise<Prison[]> {
    const prisons = RPClient.restClient(token).get({
      path: '/resettlement-passport/prisons/active',
    })
    return prisons as Promise<Prison[]>
  }
}

import type TokenStore from './tokenStore'
import config from '../config'
import RestClient from './restClient'

export default class HmppsAuthClient {
  constructor(private readonly tokenStore: TokenStore) {
    // no op
  }

  private static restClient(token: string): RestClient {
    return new RestClient('HMPPS Auth Client', config.apis.hmppsAuth, token)
  }
}

import RestClient from './restClient'
import config from '../config'
import { Component } from './model/component'

export type AvailableComponent = 'header' | 'footer'

export default class ComponentClient {
  private static restClient(token: string): RestClient {
    return new RestClient('Component API Client', config.apis.frontendComponents, token)
  }

  async getComponents<T extends AvailableComponent[]>(
    components: T,
    userToken: string,
  ): Promise<Record<T[number], Component>> {
    return ComponentClient.restClient(userToken).get({
      path: `/components`,
      query: `component=${components.join('&component=')}`,
      headers: { 'x-user-token': userToken },
    })
  }
}

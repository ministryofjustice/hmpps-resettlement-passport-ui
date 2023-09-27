import ComponentClient, { AvailableComponent } from '../data/componentClient'
import { Component } from '../data/model/component'

export default class ComponentService {
  constructor(private readonly componentClient: ComponentClient) {}

  async getComponents<T extends AvailableComponent[]>(
    components: T,
    userToken: string,
  ): Promise<Record<T[number], Component>> {
    return this.componentClient.getComponents(components, userToken)
  }
}

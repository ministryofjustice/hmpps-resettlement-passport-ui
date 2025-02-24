import { Component } from '../data/model/component'
import ComponentClient, { AvailableComponent } from '../data/componentClient'
import ComponentService from './componentService'

describe('Component Service', () => {
  const componentClient: ComponentClient = new ComponentClient() as jest.Mocked<ComponentClient>
  const service = new ComponentService(componentClient)

  it('Should get components', async () => {
    const comp: Record<AvailableComponent, Component> = {
      header: {
        html: '<h2>Header</h2>',
        css: [],
        javascript: [],
      },
      footer: {
        html: '<h2>Footer</h2>',
        css: [],
        javascript: [],
      },
    }

    jest.spyOn(componentClient, 'getComponents').mockResolvedValue(comp)

    const { header, footer } = await service.getComponents(['header', 'footer'], 'token')

    expect(header).toEqual(comp.header)
    expect(footer).toEqual(comp.footer)
  })
})

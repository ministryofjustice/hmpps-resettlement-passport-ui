import { Component } from '../data/model/component'
import ComponentClient, { AvailableComponent } from '../data/componentClient'
import ComponentService from './componentService'

describe('Component Service', () => {
  let componentClient: ComponentClient
  let service: ComponentService

  beforeAll(() => {
    componentClient = new ComponentClient() as jest.Mocked<ComponentClient>
    service = new ComponentService(componentClient)
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  it('Should get page component', async () => {
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

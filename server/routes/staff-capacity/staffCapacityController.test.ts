import request from 'supertest'
import type { Express } from 'express'
import Config from '../../s3Config'
import { configHelper } from '../configHelperTest'
import { appWithAllRoutes, mockedServices } from '../testutils/appSetup'

let app: Express
const config: jest.Mocked<Config> = new Config() as jest.Mocked<Config>
const { rpService } = mockedServices

beforeEach(() => {
  jest.mock('applicationinsights', () => jest.fn())
  configHelper(config)
  app = appWithAllRoutes({})
})
afterEach(() => {
  jest.resetAllMocks()
})

describe('getView', () => {
  it('Error case - rpService throws error', async () => {
    rpService.getAssignedWorkerList.mockRejectedValue(new Error('Something went wrong'))

    await request(app)
      .get('/staff-capacity')
      .expect(500)
      .expect(res => expect(res.text).toMatchSnapshot())

    expect(rpService.getAssignedWorkerList).toHaveBeenCalledWith('MDI')
  })

  it('Error case - rpService throws 404 error', async () => {
    const error = new Error('not found') as Error & { status?: number }
    error.status = 404

    rpService.getAssignedWorkerList.mockRejectedValue(error)

    await request(app)
      .get('/staff-capacity')
      .expect(404)
      .expect(res => expect(res.text).toMatchSnapshot())

    expect(rpService.getAssignedWorkerList).toHaveBeenCalledWith('MDI')
  })

  it('Happy path', async () => {
    rpService.getAssignedWorkerList.mockResolvedValue({
      assignedList: [
        {
          staffId: '1',
          firstName: 'Joe',
          lastName: 'Bloggs',
          count: 10,
        },
      ],
      unassignedCount: 1,
    })

    await request(app)
      .get('/staff-capacity')
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())

    expect(rpService.getAssignedWorkerList).toHaveBeenCalledWith('MDI')
  })

  it('Happy path empty list', async () => {
    rpService.getAssignedWorkerList.mockResolvedValue({
      assignedList: [],
      unassignedCount: 10,
    })

    await request(app)
      .get('/staff-capacity')
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())

    expect(rpService.getAssignedWorkerList).toHaveBeenCalledWith('MDI')
  })
})

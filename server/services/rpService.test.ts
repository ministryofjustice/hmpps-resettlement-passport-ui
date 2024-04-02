import logger from '../../logger'
import { RPClient } from '../data'
import RpService from './rpService'

jest.mock('../../logger')
jest.mock('../data')

describe('RpService', () => {
  let rpClient: jest.Mocked<RPClient>
  const loggerSpy = jest.spyOn(logger, 'warn')
  let service: RpService

  beforeEach(() => {
    rpClient = new RPClient() as jest.Mocked<RPClient>
    service = new RpService(rpClient)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should get an Otp when one exists', async () => {
    const nomsId = 'A8731DY'
    rpClient.setToken.mockResolvedValue()
    rpClient.get.mockResolvedValue({
      otp: '123456',
    })
    const otpDetails = await service.getOtp('token', 'session', nomsId)
    expect(otpDetails.otp).toBe('123456')
  })

  it('should create a new Otp when get Otp fails', async () => {
    const nomsId = 'A8731DY'
    const error = {
      status: 404
    }
    rpClient.setToken.mockResolvedValue()
    rpClient.get.mockRejectedValue(error)
    rpClient.post.mockResolvedValue({
      otp: '123456',
    })
    const otpDetails = await service.getOtp('token', 'sessionId', nomsId)
    expect(otpDetails.otp).toBe('123456')
    expect(loggerSpy).toHaveBeenCalledWith(`Session: sessionId Cannot get otp for ${nomsId} ${error.status} ${error}, creating a new otp instead`)
  })
})

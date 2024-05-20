import logger from '../../logger'
import { RPClient } from '../data'
import RpService from './rpService'
import { AssessmentSkipRequest } from '../data/model/assessmentInformation'

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
      status: 404,
    }
    rpClient.setToken.mockResolvedValue()
    rpClient.get.mockRejectedValue(error)
    rpClient.post.mockResolvedValue({
      otp: '123456',
    })
    const otpDetails = await service.getOtp('token', 'sessionId', nomsId)
    expect(otpDetails.otp).toBe('123456')
    expect(loggerSpy).toHaveBeenCalledWith(`Session: sessionId Cannot get otp for ${nomsId} ${error.status} ${error}`)
  })

  it('should call rpClient correctly when fetching assessment', async () => {
    rpClient.get.mockResolvedValue({})
    const spy = jest.spyOn(rpClient, 'get')
    const prisonerNumber = '6'
    await service.fetchAssessment(prisonerNumber)

    expect(spy).toHaveBeenCalledWith(`/resettlement-passport/prisoner/${prisonerNumber}/assessment`)
  })

  it('should call rpClient correctly when posting assessment', async () => {
    rpClient.get.mockResolvedValue({})
    const spy = jest.spyOn(rpClient, 'post')
    const prisonerNumber = '6'
    const body = { test: 'test' }
    await service.postAssessment(prisonerNumber, body)

    expect(spy).toHaveBeenCalledWith(`/resettlement-passport/prisoner/${prisonerNumber}/assessment`, body)
  })

  it('should call rpClient correctly when posting bank application', async () => {
    rpClient.get.mockResolvedValue({})
    const spy = jest.spyOn(rpClient, 'post')
    const prisonerNumber = '6'
    const body = { test: 'test' }
    await service.postBankApplication(prisonerNumber, body)

    expect(spy).toHaveBeenCalledWith(`/resettlement-passport/prisoner/${prisonerNumber}/bankapplication`, body)
  })

  it('should call rpClient correctly when posting id application', async () => {
    rpClient.get.mockResolvedValue({})
    const spy = jest.spyOn(rpClient, 'post')
    const prisonerNumber = '6'
    const body = { test: 'test' }
    await service.postIdApplication(prisonerNumber, body)

    expect(spy).toHaveBeenCalledWith(`/resettlement-passport/prisoner/${prisonerNumber}/idapplication`, body)
  })

  it('should call rpClient correctly when patching bank application', async () => {
    rpClient.get.mockResolvedValue({})
    const spy = jest.spyOn(rpClient, 'patch')
    const prisonerNumber = '6'
    const applicationId = '1'
    const body = { test: 'test' }
    await service.patchBankApplication(prisonerNumber, applicationId, body)

    expect(spy).toHaveBeenCalledWith(
      `/resettlement-passport/prisoner/${prisonerNumber}/bankapplication/${applicationId}`,
      body,
    )
  })

  it('should call rpClient correctly when patching id application', async () => {
    rpClient.get.mockResolvedValue({})
    const spy = jest.spyOn(rpClient, 'patch')
    const prisonerNumber = '6'
    const applicationId = '1'
    const body = { test: 'test' }
    await service.patchIdApplication(prisonerNumber, applicationId, body)

    expect(spy).toHaveBeenCalledWith(
      `/resettlement-passport/prisoner/${prisonerNumber}/idapplication/${applicationId}`,
      body,
    )
  })

  it('should call rpClient correctly when deleting an assessment', async () => {
    rpClient.get.mockResolvedValue({})
    const spy = jest.spyOn(rpClient, 'delete')
    const prisonerNumber = '6'
    const applicationId = '1'
    await service.deleteAssessment(prisonerNumber, applicationId)

    expect(spy).toHaveBeenCalledWith(`/resettlement-passport/prisoner/${prisonerNumber}/assessment/${applicationId}`)
  })

  it('should call rpClient correctly when fetching finance', async () => {
    rpClient.get.mockResolvedValue({})
    const spy = jest.spyOn(rpClient, 'get')
    const prisonerNumber = '6'
    await service.fetchFinance(prisonerNumber)

    expect(spy).toHaveBeenCalledWith(`/resettlement-passport/prisoner/${prisonerNumber}/bankapplication`)
  })

  it('should call rpClient correctly when deleting finance', async () => {
    rpClient.get.mockResolvedValue({})
    const spy = jest.spyOn(rpClient, 'delete')
    const prisonerNumber = '6'
    const financeId = '1'
    await service.deleteFinance(prisonerNumber, financeId)

    expect(spy).toHaveBeenCalledWith(`/resettlement-passport/prisoner/${prisonerNumber}/bankapplication/${financeId}`)
  })

  it('should call rpClient correctly when fetching id', async () => {
    rpClient.get.mockResolvedValue({})
    const spy = jest.spyOn(rpClient, 'get')
    const prisonerNumber = '6'
    await service.fetchId(prisonerNumber)

    expect(spy).toHaveBeenCalledWith(`/resettlement-passport/prisoner/${prisonerNumber}/idapplication/all`)
  })

  it('should call rpClient correctly when deleting id', async () => {
    rpClient.get.mockResolvedValue({})
    const spy = jest.spyOn(rpClient, 'delete')
    const prisonerNumber = '6'
    const idId = '1'
    await service.deleteId(prisonerNumber, idId)

    expect(spy).toHaveBeenCalledWith(`/resettlement-passport/prisoner/${prisonerNumber}/idapplication/${idId}`)
  })

  it('should call rpClient correctly when skipping assessment', async () => {
    rpClient.get.mockResolvedValue({})
    const postSpy = jest.spyOn(rpClient, 'post')
    const setTokenSpy = jest.spyOn(rpClient, 'setToken')
    const prisonerNumber = '6'
    const token = 'userToken'
    const request: AssessmentSkipRequest = { reason: 'COMPLETED_IN_ANOTHER_PRISON' }
    await service.postAssessmentSkip(token, prisonerNumber, request)

    expect(setTokenSpy).toHaveBeenCalledWith(token)
    expect(postSpy).toHaveBeenCalledWith(
      `/resettlement-passport/prisoner/${prisonerNumber}/resettlement-assessment/skip`,
      request,
    )
  })
})

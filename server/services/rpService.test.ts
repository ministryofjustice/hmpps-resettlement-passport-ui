import logger from '../../logger'
import { RPClient } from '../data'
import RpService from './rpService'
import { AssessmentSkipRequest } from '../data/model/assessmentInformation'
import FeatureFlags from '../featureFlag'

jest.mock('../../logger')
jest.mock('../data')

describe('RpService', () => {
  let rpClient: jest.Mocked<RPClient>
  const loggerSpy = jest.spyOn(logger, 'warn')
  const featureFlags = new FeatureFlags() as jest.Mocked<FeatureFlags>
  let service: RpService

  beforeEach(() => {
    rpClient = new RPClient('token', 'sessionId', 'userId') as jest.Mocked<RPClient>
    service = new RpService()
    service.createClient = () => rpClient
    Object.defineProperty(rpClient, 'sessionId', { value: 'sessionId', writable: false })
    FeatureFlags.getInstance = jest.fn().mockReturnValue(featureFlags)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should get an Otp when one exists', async () => {
    const nomsId = 'A8731DY'
    rpClient.get.mockResolvedValue({
      otp: '123456',
    })
    const otpDetails = await service.getOtp(nomsId)
    expect(otpDetails.otp).toBe('123456')
  })

  it('should create a new Otp when get Otp fails', async () => {
    const nomsId = 'A8731DY'
    const error = {
      status: 404,
    }
    rpClient.get.mockRejectedValue(error)
    rpClient.post.mockResolvedValue({
      otp: '123456',
    })

    const otpDetails = await service.getOtp(nomsId)
    expect(otpDetails.otp).toBe('123456')
    expect(loggerSpy).toHaveBeenCalledWith(`Session: sessionId Cannot get otp for ${nomsId} ${error.status} ${error}`)
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
    const prisonerNumber = '6'
    const request: AssessmentSkipRequest = { reason: 'COMPLETED_IN_ANOTHER_PRISON' }
    await service.postAssessmentSkip(prisonerNumber, request)

    expect(postSpy).toHaveBeenCalledWith(
      `/resettlement-passport/prisoner/${prisonerNumber}/resettlement-assessment/skip`,
      request,
    )
  })

  it('should call submit assessment with useNewDpsCaseNoteFormat set to false if feature flag is off', async () => {
    const spy = jest.spyOn(rpClient, 'post').mockResolvedValue({})
    jest.spyOn(featureFlags, 'getFeatureFlags').mockResolvedValue([
      { feature: 'useNewDeliusCaseNoteFormat', enabled: true },
      { feature: 'useNewDpsCaseNoteFormat', enabled: false },
    ])
    const result = await service.submitAssessment('123', 'BCST2')
    expect(result).toEqual({})
    expect(spy).toHaveBeenCalledWith(
      '/resettlement-passport/prisoner/123/resettlement-assessment/submit?assessmentType=BCST2&useNewDeliusCaseNoteFormat=true&useNewDpsCaseNoteFormat=false',
      null,
    )
  })

  it('should call submit assessment with useNewDpsCaseNoteFormat set to true if feature flag is on', async () => {
    const spy = jest.spyOn(rpClient, 'post').mockResolvedValue({})
    jest.spyOn(featureFlags, 'getFeatureFlags').mockResolvedValue([
      { feature: 'useNewDeliusCaseNoteFormat', enabled: true },
      { feature: 'useNewDpsCaseNoteFormat', enabled: true },
    ])
    const result = await service.submitAssessment('123', 'BCST2')
    expect(result).toEqual({})
    expect(spy).toHaveBeenCalledWith(
      '/resettlement-passport/prisoner/123/resettlement-assessment/submit?assessmentType=BCST2&useNewDeliusCaseNoteFormat=true&useNewDpsCaseNoteFormat=true',
      null,
    )
  })

  it('should call submit assessment and any exception sets the error flag', async () => {
    const spy = jest.spyOn(rpClient, 'post').mockRejectedValue(new Error('Something went wrong'))
    jest.spyOn(featureFlags, 'getFeatureFlags').mockResolvedValue([
      { feature: 'useNewDeliusCaseNoteFormat', enabled: true },
      { feature: 'useNewDpsCaseNoteFormat', enabled: true },
    ])
    const result = await service.submitAssessment('123', 'BCST2')
    expect(result).toEqual({ error: true })
    expect(spy).toHaveBeenCalledWith(
      '/resettlement-passport/prisoner/123/resettlement-assessment/submit?assessmentType=BCST2&useNewDeliusCaseNoteFormat=true&useNewDpsCaseNoteFormat=true',
      null,
    )
  })
})

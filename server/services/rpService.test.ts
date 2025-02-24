import logger from '../../logger'
import { RPClient } from '../data'
import RpService from './rpService'
import { AssessmentSkipRequest } from '../data/model/assessmentInformation'
import FeatureFlags from '../featureFlag'
import { stubFeatureFlagToFalse, stubFeatureFlagToTrue } from '../routes/testutils/testUtils'
import { SupportNeedStatus } from '../data/model/supportNeedStatus'
import { PrisonerSupportNeedsPatch } from '../data/model/supportNeeds'
import { CaseNote } from '../data/model/caseNotesHistory'
import { ERROR_DICTIONARY } from '../utils/constants'

jest.mock('../../logger')
jest.mock('../data')
jest.mock('../data/rpClient')

describe('RpService', () => {
  let rpClient: jest.Mocked<RPClient>
  const loggerSpy = jest.spyOn(logger, 'warn')
  const featureFlags = new FeatureFlags() as jest.Mocked<FeatureFlags>
  let service: RpService

  beforeEach(() => {
    rpClient = jest.mocked(new RPClient('token', 'sessionId', 'userId'))
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
    stubFeatureFlagToTrue(featureFlags, ['useNewDeliusCaseNoteFormat'])
    const result = await service.submitAssessment('123', 'BCST2')
    expect(result).toEqual({})
    expect(spy).toHaveBeenCalledWith(
      '/resettlement-passport/prisoner/123/resettlement-assessment/submit?assessmentType=BCST2&useNewDeliusCaseNoteFormat=true&useNewDpsCaseNoteFormat=false',
      null,
    )
  })

  it('should call submit assessment with useNewDpsCaseNoteFormat set to true if feature flag is on', async () => {
    const spy = jest.spyOn(rpClient, 'post').mockResolvedValue({})
    stubFeatureFlagToTrue(featureFlags, ['useNewDeliusCaseNoteFormat', 'useNewDpsCaseNoteFormat'])
    const result = await service.submitAssessment('123', 'BCST2')
    expect(result).toEqual({})
    expect(spy).toHaveBeenCalledWith(
      '/resettlement-passport/prisoner/123/resettlement-assessment/submit?assessmentType=BCST2&useNewDeliusCaseNoteFormat=true&useNewDpsCaseNoteFormat=true',
      null,
    )
  })

  it('should call submit assessment and any exception sets the error flag', async () => {
    const spy = jest.spyOn(rpClient, 'post').mockRejectedValue(new Error('Something went wrong'))
    stubFeatureFlagToTrue(featureFlags, ['useNewDeliusCaseNoteFormat', 'useNewDpsCaseNoteFormat'])
    const result = await service.submitAssessment('123', 'BCST2')
    expect(result).toEqual({ error: true })
    expect(spy).toHaveBeenCalledWith(
      '/resettlement-passport/prisoner/123/resettlement-assessment/submit?assessmentType=BCST2&useNewDeliusCaseNoteFormat=true&useNewDpsCaseNoteFormat=true',
      null,
    )
  })

  it('should call submit assessment with supportNeedsLegacyProfile=false if feature flag is on', async () => {
    const spy = jest.spyOn(rpClient, 'post').mockResolvedValue({})
    stubFeatureFlagToTrue(featureFlags, ['supportNeeds'])
    const result = await service.submitAssessment('123', 'BCST2')
    expect(result).toEqual({})
    expect(spy).toHaveBeenCalledWith(
      '/resettlement-passport/prisoner/123/resettlement-assessment/submit?assessmentType=BCST2&useNewDeliusCaseNoteFormat=false&useNewDpsCaseNoteFormat=false&supportNeedsLegacyProfile=false',
      null,
    )
  })

  it('should call submit assessment without supportNeedsLegacyProfile=false if feature flag is off', async () => {
    const spy = jest.spyOn(rpClient, 'post').mockResolvedValue({})
    stubFeatureFlagToFalse(featureFlags)
    const result = await service.submitAssessment('123', 'BCST2')
    expect(result).toEqual({})
    expect(spy).toHaveBeenCalledWith(
      '/resettlement-passport/prisoner/123/resettlement-assessment/submit?assessmentType=BCST2&useNewDeliusCaseNoteFormat=false&useNewDpsCaseNoteFormat=false',
      null,
    )
  })

  it('should post case allocations', async () => {
    const response = [
      {
        nomsId: 'ABC',
        staffId: '123',
      },
    ]
    rpClient.post.mockResolvedValue(response)

    const body = {
      staffId: 123,
      nomsIds: ['ABC'],
      prisonId: 'prison',
    }
    const result = await service.postCaseAllocations(body)
    expect(result).toEqual(response)
    expect(rpClient.post).toHaveBeenCalledWith('/resettlement-passport/workers/cases', body)
  })

  it('should unassign case allocations', async () => {
    const body = {
      nomsIds: ['ABC'],
    }
    await service.unassignCaseAllocations(body)

    expect(rpClient.patch).toHaveBeenCalledWith('/resettlement-passport/workers/cases', body)
  })

  it('should call getSupportNeedsSummary if feature flag for SUPPORT_NEEDS is enabled', async () => {
    const spy = jest.spyOn(rpClient, 'get').mockResolvedValue({})
    stubFeatureFlagToTrue(featureFlags, ['SUPPORT_NEEDS'])
    const result = await service.getSupportNeedsSummary('123')
    expect(result).toEqual({})
    expect(spy).toHaveBeenCalledWith('/resettlement-passport/prisoner/123/needs/summary')
  })

  it('test getPathwayNeedsUpdates', async () => {
    const spy = jest.spyOn(rpClient, 'get').mockResolvedValue({})
    const result = await service.getPathwayNeedsUpdates('123', 'ACCOMMODATION', 0, 5, 'createdDate,DESC', '12')
    expect(result).toEqual({})
    expect(spy).toHaveBeenCalledWith(
      '/resettlement-passport/prisoner/123/needs/ACCOMMODATION/updates?page=0&size=5&sort=createdDate,DESC&filterByPrisonerSupportNeedId=12',
    )
  })

  it('test getPrisonerNeedById', async () => {
    const spy = jest.spyOn(rpClient, 'get').mockResolvedValue({})
    const result = await service.getPrisonerNeedById('123', '124')
    expect(result).toEqual({})
    expect(spy).toHaveBeenCalledWith('/resettlement-passport/prisoner/123/prisoner-need/124')
  })

  it('test patchSupportNeedById', async () => {
    const supportNeedsPatch: PrisonerSupportNeedsPatch = {
      text: 'This is some text',
      status: SupportNeedStatus.IN_PROGRESS,
      isPrisonResponsible: true,
      isProbationResponsible: false,
    }

    const spy = jest.spyOn(rpClient, 'patch').mockImplementation()
    await service.patchSupportNeedById('123', '124', supportNeedsPatch)
    expect(spy).toHaveBeenCalledWith('/resettlement-passport/prisoner/123/need/124', supportNeedsPatch)
  })

  it('test getCaseNotesHistory returns case notes', async () => {
    const caseNotes: CaseNote = {
      content: [],
      pageSize: 1,
      page: 1,
      sortName: 'sort',
      totalElements: 0,
      last: true,
    }

    const prisonerId = 'prisonerId'
    const pathway = 'pathway'
    const createdByUserId = 'userId'
    const size = 'size'
    const page = 'page'
    const sort = 'sort'
    const days = 'days'

    const spy = jest.spyOn(rpClient, 'get').mockResolvedValueOnce(caseNotes)
    const url = `/resettlement-passport/case-notes/${prisonerId}?page=${page}&size=${size}&sort=${sort}&days=${days}&pathwayType=${pathway}&createdByUserId=${createdByUserId}`

    const result = await service.getCaseNotesHistory(prisonerId, pathway, createdByUserId, size, page, sort, days)

    expect(spy).toHaveBeenCalledWith(url)
    expect(result).toEqual({ results: caseNotes })
  })

  it('test getCaseNotesHistory handles errors', async () => {
    const prisonerId = 'prisonerId'
    const pathway = 'pathway'
    const createdByUserId = 'userId'
    const size = 'size'
    const page = 'page'
    const sort = 'sort'
    const days = 'days'

    const spy = jest.spyOn(rpClient, 'get').mockRejectedValueOnce(Error('something went wrong'))
    const url = `/resettlement-passport/case-notes/${prisonerId}?page=${page}&size=${size}&sort=${sort}&days=${days}&pathwayType=${pathway}&createdByUserId=${createdByUserId}`

    const result = await service.getCaseNotesHistory(prisonerId, pathway, createdByUserId, size, page, sort, days)

    expect(spy).toHaveBeenCalledWith(url)
    expect(result).toEqual({ error: ERROR_DICTIONARY.DATA_UNAVAILABLE })
  })
})

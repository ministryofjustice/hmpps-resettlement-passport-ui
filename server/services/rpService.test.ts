import logger from '../../logger'
import { RPClient } from '../data'
import RpService from './rpService'
import { AssessmentSkipRequest } from '../data/model/assessmentInformation'
import FeatureFlags from '../featureFlag'
import { stubFeatureFlagToFalse, stubFeatureFlagToTrue } from '../routes/testutils/testUtils'
import { SupportNeedStatus } from '../data/model/supportNeedStatus'
import { CaseNote } from '../data/model/caseNotesHistory'
import { ERROR_DICTIONARY } from '../utils/constants'
import { PrisonerSupportNeedsPatch, PrisonerSupportNeedsPost } from '../data/model/supportNeeds'
import { ResetReason } from '../data/model/resetProfile'
import { Appointments } from '../data/model/appointment'
import { AssessmentStatus } from '../data/model/assessmentStatus'
import { CachedAssessment } from '../data/model/immediateNeedsReport'

jest.mock('../../logger')
jest.mock('../data')
jest.mock('../data/rpClient')

describe('RpService', () => {
  let rpClient: jest.Mocked<RPClient>
  const loggerSpy = jest.spyOn(logger, 'warn')
  const featureFlags = new FeatureFlags() as jest.Mocked<FeatureFlags>
  let service: RpService
  const cachedAssessment: CachedAssessment = {
    questionsAndAnswers: [
      {
        question: 'QUESTION_1',
        questionTitle: 'Question 1',
        pageId: 'PAGE_1',
        questionType: 'LONG_TEXT',
        answer: {
          answer: 'This is the answer to question 1',
          displayText: 'This is the answer to question 1',
          '@class': 'StringAnswer',
        },
      },
    ],
    version: 1,
  }

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

  it('test postSupportNeeds', async () => {
    const supportNeedsPost: PrisonerSupportNeedsPost = {
      needs: [
        {
          needId: 1,
          prisonerSupportNeedId: 22,
          isPrisonResponsible: true,
          isProbationResponsible: true,
          otherDesc: null,
          status: 'MET',
          text: 'some text from the additional details',
        },
        {
          needId: 2,
          prisonerSupportNeedId: null,
          isPrisonResponsible: false,
          isProbationResponsible: true,
          otherDesc: null,
          status: 'IN_PROGRESS',
          text: 'Another textarea',
        },
      ],
    }

    const spy = jest.spyOn(rpClient, 'post').mockImplementation()
    await service.postSupportNeeds('123', supportNeedsPost)
    expect(spy).toHaveBeenCalledWith('/resettlement-passport/prisoner/123/needs', supportNeedsPost)
  })

  it('should call rpClient correctly when resetting profile', async () => {
    rpClient.get.mockResolvedValue({})
    const postSpy = jest.spyOn(rpClient, 'post')
    const prisonerNumber = '6'
    const resetReason: ResetReason = { resetReason: 'RECALL_TO_PRISON', additionalDetails: '' }
    await service.resetProfile(prisonerNumber, resetReason, true)

    expect(postSpy).toHaveBeenCalledWith(
      `/resettlement-passport/prisoner/${prisonerNumber}/reset-profile?supportNeedsEnabled=true`,
      resetReason,
    )
  })

  it('should call rpClient correctly when searching prisoners', async () => {
    rpClient.get.mockResolvedValue({})
    const getSpy = jest.spyOn(rpClient, 'get')

    const prisonSelected = 'MDI'
    const page = 1
    const pageSize = 10
    const sortField = 'releaseDate'
    const sortDirection = 'ASC'
    const searchInput = ''
    const releaseTime = ''
    const pathwayView = ''
    const pathwayStatus = ''
    const watchList = ''
    const includePastReleaseDates = true
    const workerId = ''
    const lastReportCompleted = ''

    await service.getListOfPrisoners(
      prisonSelected,
      page,
      pageSize,
      sortField,
      sortDirection,
      searchInput,
      releaseTime,
      pathwayView,
      pathwayStatus,
      watchList,
      includePastReleaseDates,
      workerId,
      lastReportCompleted,
    )

    expect(getSpy).toHaveBeenCalledWith(
      `/resettlement-passport/prison/${prisonSelected}/prisoners?page=${page}&size=${pageSize}&sort=${sortField},${sortDirection}&term=${searchInput}&days=${releaseTime}&pathwayView=${pathwayView}&pathwayStatus=${pathwayStatus}&watchList=${watchList}&includePastReleaseDates=${includePastReleaseDates}&workerId=${workerId}&lastReportCompleted=${lastReportCompleted}`,
    )
  })

  it('should call rpClient with url encoded searchInput', async () => {
    rpClient.get.mockResolvedValue({})
    const getSpy = jest.spyOn(rpClient, 'get')

    const searchInput = 'John Smith'
    await service.getListOfPrisoners('MDI', 1, 10, 'releaseDate', 'ASC', searchInput, '', '', '', '', true, '', '')

    expect(getSpy).toHaveBeenCalledWith(
      `/resettlement-passport/prison/MDI/prisoners?page=1&size=10&sort=releaseDate,ASC&term=John%20Smith&days=&pathwayView=&pathwayStatus=&watchList=&includePastReleaseDates=true&workerId=&lastReportCompleted=`,
    )
  })

  it('should return appointments on success', async () => {
    const mockAppointments: Appointments = {
      results: [{ title: 'Mr.', contact: 'Smith' }],
    }
    const getSpy = jest.spyOn(rpClient, 'get')
    rpClient.get.mockResolvedValue(mockAppointments)

    const result = await service.getAppointments('A1234BC')

    expect(getSpy).toHaveBeenCalledWith('/resettlement-passport/prisoner/A1234BC/appointments?futureOnly=true')
    expect(result).toEqual(mockAppointments)
  })

  it('should return DATA_NOT_FOUND error for 404', async () => {
    const error = { status: 404 }
    rpClient.get.mockRejectedValue(error)

    const result = await service.getAppointments('A1234BC')

    expect(result).toEqual({
      error: ERROR_DICTIONARY.DATA_NOT_FOUND,
      results: [],
    })
  })

  it('should return DATA_UNAVAILABLE error for non-404', async () => {
    const error = { status: 500, message: 'Server error' }
    rpClient.get.mockRejectedValue(error)

    const result = await service.getAppointments('A1234BC')

    expect(result).toEqual({
      error: ERROR_DICTIONARY.DATA_UNAVAILABLE,
      results: [],
    })
  })

  it('should return assessments summary when successful', async () => {
    const mockResponse: AssessmentStatus[] = [
      {
        pathway: 'Education',
        assessmentStatus: 'COMPLETE',
      },
      {
        pathway: 'Accommodation',
        assessmentStatus: 'IN_PROGRESS',
      },
    ]
    const getSpy = jest.spyOn(rpClient, 'get')
    rpClient.get.mockResolvedValue(mockResponse)

    const result = await service.getAssessmentSummary('A1234BC', 'RESETTLEMENT_PLAN')

    expect(getSpy).toHaveBeenCalledWith(
      '/resettlement-passport/prisoner/A1234BC/resettlement-assessment/summary?assessmentType=RESETTLEMENT_PLAN',
    )
    expect(result).toEqual({ results: mockResponse })
  })

  it('should return error summary and log when API fails', async () => {
    const error = { status: 500, message: 'Internal Server Error' }
    rpClient.get.mockRejectedValue(error)

    const result = await service.getAssessmentSummary('A1234BC', 'RESETTLEMENT_PLAN')

    expect(result).toEqual({
      error: ERROR_DICTIONARY.DATA_UNAVAILABLE,
    })
  })

  it('should return valid: true when validation succeeds', async () => {
    rpClient.post.mockResolvedValue(undefined) // no error = success

    const result = await service.validateAssessment('A1234BC', 'Accomodation', cachedAssessment, 'RESETTLEMENT_PLAN')

    expect(rpClient.post).toHaveBeenCalledWith(
      `/resettlement-passport/prisoner/A1234BC/resettlement-assessment/Accomodation/validate?assessmentType=RESETTLEMENT_PLAN`,
      cachedAssessment,
    )
    expect(result).toEqual({ valid: true })
  })

  it('should return valid: false when API returns 400', async () => {
    const error = { status: 400 }
    rpClient.post.mockRejectedValue(error)

    const result = await service.validateAssessment('A1234BC', 'Accomodation', cachedAssessment, 'RESETTLEMENT_PLAN')

    expect(result).toEqual({ valid: false })
  })

  it('should return error when API fails with non-400', async () => {
    const error = { status: 500 }
    rpClient.post.mockRejectedValue(error)

    const result = await service.validateAssessment('A1234BC', 'Accomodation', cachedAssessment, 'RESETTLEMENT_PLAN')

    expect(result).toEqual({ error: ERROR_DICTIONARY.DATA_UNAVAILABLE })
  })
})

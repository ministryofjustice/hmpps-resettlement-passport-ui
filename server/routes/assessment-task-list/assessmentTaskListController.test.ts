import { Request, Response } from 'express'
import { addMonths, format } from 'date-fns'
import * as utils from '../../utils/utils'
import RpService from '../../services/rpService'
import AssessmentTaskListController from './assessmentTaskListController'
import { AssessmentsSummary, PathwayAssessmentStatus } from '../../data/model/assessmentStatus'

const dateOutsideReleaseWindow = addMonths(new Date(), 6)
const dateInsideReleaseWindow = addMonths(new Date(), 1)

function assessmentSummary(assessmentStatus: PathwayAssessmentStatus): AssessmentsSummary {
  return {
    results: [
      {
        pathway: 'ACCOMMODATION',
        assessmentStatus,
      },
    ],
  }
}

describe('assessmentTaskListController', () => {
  let rpService: jest.Mocked<RpService>
  let res: Response
  let next: jest.Mock
  let controller: AssessmentTaskListController

  beforeEach(async () => {
    rpService = new RpService() as jest.Mocked<RpService>
    res = { redirect: jest.fn(), render: jest.fn() } as unknown as Response
    next = jest.fn(() => () => {})
    controller = new AssessmentTaskListController(rpService)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('Should render when BCST2 is started', async () => {
    jest.spyOn(utils, 'getFeatureFlagBoolean').mockResolvedValue(true)
    jest.spyOn(rpService, 'getAssessmentSummary').mockResolvedValue(assessmentSummary('COMPLETE'))

    const req = aRequest()

    await controller.getView(req, res, next)

    expect(next).toHaveBeenCalledTimes(0)
    expect(res.render).toHaveBeenCalledTimes(1)
  })

  it('Should redirect to skip when BCST2 is not started and in the pre-release window', async () => {
    jest.spyOn(utils, 'getFeatureFlagBoolean').mockResolvedValue(true)
    jest.spyOn(rpService, 'getAssessmentSummary').mockResolvedValue(assessmentSummary('NOT_STARTED'))

    const req = aRequest(dateInsideReleaseWindow)

    await controller.getView(req, res, next)

    expect(next).toHaveBeenCalledTimes(0)
    expect(res.redirect).toHaveBeenCalledTimes(1)
    expect(res.redirect).toHaveBeenCalledWith('/assessment-skip?prisonerNumber=123')
  })

  it('Should not redirect when outside the release window', async () => {
    jest.spyOn(utils, 'getFeatureFlagBoolean').mockResolvedValue(true)
    jest.spyOn(rpService, 'getAssessmentSummary').mockResolvedValue(assessmentSummary('NOT_STARTED'))

    const req = aRequest(dateOutsideReleaseWindow)

    await controller.getView(req, res, next)

    expect(next).toHaveBeenCalledTimes(0)
    expect(res.redirect).toHaveBeenCalledTimes(0)
    expect(res.render).toHaveBeenCalledTimes(1)
  })

  it('Should should redirect to RESETTLEMENT plan if in progress and BCST2 not started', async () => {
    jest.spyOn(utils, 'getFeatureFlagBoolean').mockResolvedValue(true)
    jest
      .spyOn(rpService, 'getAssessmentSummary')
      .mockResolvedValueOnce(assessmentSummary('NOT_STARTED'))
      .mockResolvedValueOnce(assessmentSummary('COMPLETE'))

    const req = aRequest(dateInsideReleaseWindow)

    await controller.getView(req, res, next)

    expect(next).toHaveBeenCalledTimes(0)
    expect(res.redirect).toHaveBeenCalledTimes(1)
    expect(res.redirect).toHaveBeenCalledWith('/assessment-task-list?prisonerNumber=123&type=RESETTLEMENT_PLAN')
  })

  function aRequest(releaseDate = dateInsideReleaseWindow): Request {
    return {
      sessionId: 'sessionId',
      user: {
        token: 'authToken',
      },
      prisonerData: {
        personalDetails: {
          prisonerNumber: '123',
          releaseDate: format(releaseDate, 'yyyy-MM-dd'),
        },
      },
      query: {
        type: 'BCST2',
      },
    } as unknown as Request
  }
})

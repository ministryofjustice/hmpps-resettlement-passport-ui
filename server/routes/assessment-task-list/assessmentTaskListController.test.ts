import { type Express } from 'express'
import { addMonths } from 'date-fns'
import request from 'supertest'
import RpService from '../../services/rpService'
import { AssessmentsSummary, PathwayAssessmentStatus } from '../../data/model/assessmentStatus'
import Config from '../../s3Config'
import { stubPrisonerDetails } from '../testutils/testUtils'
import { configHelper } from '../configHelperTest'
import { appWithAllRoutes, mockedServices } from '../testutils/appSetup'

let app: Express
const { rpService } = mockedServices
const config: jest.Mocked<Config> = new Config() as jest.Mocked<Config>

beforeEach(() => {
  stubPrisonerDetails(rpService)
  configHelper(config)

  app = appWithAllRoutes({})
})

afterEach(() => {
  jest.resetAllMocks()
})

const dateOutsideReleaseWindow = addMonths(new Date(), 6).toISOString().slice(0, 10)
const dateInsideReleaseWindow = addMonths(new Date(), 1).toISOString().slice(0, 10)

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

describe('getView', () => {
  it('Should render when BCST2 is started', async () => {
    const getAssessmentSummarySpy = jest
      .spyOn(rpService, 'getAssessmentSummary')
      .mockResolvedValue(assessmentSummary('COMPLETE'))

    await request(app)
      .get('/assessment-task-list?prisonerNumber=A1234DY&type=BCST2')
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())

    expect(getAssessmentSummarySpy).toHaveBeenCalledWith('A1234DY', 'BCST2')
  })

  it('Should redirect to skip when BCST2 is not started and in the pre-release window', async () => {
    const getAssessmentSummarySpy = jest
      .spyOn(rpService, 'getAssessmentSummary')
      .mockResolvedValue(assessmentSummary('NOT_STARTED'))
    stubPrisonerDetails(rpService, dateInsideReleaseWindow)

    await request(app)
      .get('/assessment-task-list?prisonerNumber=A1234DY&type=BCST2')
      .expect(302)
      .expect(res => expect(res.text).toEqual('Found. Redirecting to /assessment-skip?prisonerNumber=A1234DY'))

    expect(getAssessmentSummarySpy).toHaveBeenNthCalledWith(1, 'A1234DY', 'BCST2')
    expect(getAssessmentSummarySpy).toHaveBeenNthCalledWith(2, 'A1234DY', 'RESETTLEMENT_PLAN')
  })

  it('Should not redirect when outside the release window', async () => {
    const getAssessmentSummarySpy = jest
      .spyOn(rpService, 'getAssessmentSummary')
      .mockResolvedValue(assessmentSummary('NOT_STARTED'))
    stubPrisonerDetails(rpService, dateOutsideReleaseWindow)

    await request(app)
      .get('/assessment-task-list?prisonerNumber=A1234DY&type=BCST2')
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())

    expect(getAssessmentSummarySpy).toHaveBeenCalledWith('A1234DY', 'BCST2')
  })

  it('Should should redirect to RESETTLEMENT plan if in progress and BCST2 not started', async () => {
    const getAssessmentSummarySpy = jest
      .spyOn(rpService, 'getAssessmentSummary')
      .mockResolvedValueOnce(assessmentSummary('NOT_STARTED'))
      .mockResolvedValueOnce(assessmentSummary('COMPLETE'))
    stubPrisonerDetails(rpService, dateInsideReleaseWindow)

    await request(app)
      .get('/assessment-task-list?prisonerNumber=A1234DY&type=BCST2')
      .expect(302)
      .expect(res =>
        expect(res.text).toEqual(
          'Found. Redirecting to /assessment-task-list?prisonerNumber=A1234DY&type=RESETTLEMENT_PLAN',
        ),
      )

    expect(getAssessmentSummarySpy).toHaveBeenNthCalledWith(1, 'A1234DY', 'BCST2')
    expect(getAssessmentSummarySpy).toHaveBeenNthCalledWith(2, 'A1234DY', 'RESETTLEMENT_PLAN')
  })

  it('Should not redirect to skip when BCST2 is not started and in the pre-release window if force is set', async () => {
    const getAssessmentSummarySpy = jest
      .spyOn(rpService, 'getAssessmentSummary')
      .mockResolvedValue(assessmentSummary('NOT_STARTED'))
    stubPrisonerDetails(rpService, dateInsideReleaseWindow)

    await request(app)
      .get('/assessment-task-list?prisonerNumber=A1234DY&type=BCST2&force=true')
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())

    expect(getAssessmentSummarySpy).toHaveBeenCalledWith('A1234DY', 'BCST2')
  })

  it('Error case - prisonerNumber is missing', async () => {
    await request(app)
      .get('/assessment-task-list?type=BCST2')
      .expect(500)
      .expect(res => expect(res.text).toMatchSnapshot())
  })

  it('Error case - type is missing', async () => {
    await request(app)
      .get('/assessment-task-list?prisonerNumber=A1234DY')
      .expect(500)
      .expect(res => expect(res.text).toMatchSnapshot())
  })

  it('Error case - rpService throws error', async () => {
    const getAssessmentSummarySpy = jest
      .spyOn(rpService, 'getAssessmentSummary')
      .mockRejectedValue(new Error('Something went wrong'))

    await request(app)
      .get('/assessment-task-list?prisonerNumber=A1234DY&type=BCST2')
      .expect(500)
      .expect(res => expect(res.text).toMatchSnapshot())

    expect(getAssessmentSummarySpy).toHaveBeenCalledWith('A1234DY', 'BCST2')
  })

  it('Error case - rpService returns error render page with error message', async () => {
    const getAssessmentSummarySpy = jest
      .spyOn(rpService, 'getAssessmentSummary')
      .mockResolvedValue({ error: 'Something went wrong' })

    await request(app)
      .get('/assessment-task-list?prisonerNumber=A1234DY&type=BCST2')
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())

    expect(getAssessmentSummarySpy).toHaveBeenCalledWith('A1234DY', 'BCST2')
  })
})

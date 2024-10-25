import type { Express } from 'express'
import request from 'supertest'
import RpService from '../../services/rpService'
import { appWithAllRoutes } from '../testutils/appSetup'
import { stubPrisonerDetails } from '../testutils/testUtils'
import { configHelper } from '../configHelperTest'
import Config from '../../s3Config'

let app: Express
let rpService: jest.Mocked<RpService>
const config: jest.Mocked<Config> = new Config() as jest.Mocked<Config>

beforeEach(() => {
  rpService = new RpService() as jest.Mocked<RpService>
  stubPrisonerDetails(rpService)
  configHelper(config)

  app = appWithAllRoutes({
    services: {
      rpService,
    },
  })
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('getView', () => {
  it('Happy path with default query params', async () => {
    const getCrsReferralsSpy = jest.spyOn(rpService, 'getCrsReferrals').mockResolvedValue({
      results: [
        {
          pathway: 'ACCOMMODATION',
          referrals: [
            {
              serviceCategories: ['Cat 1', 'Cat 2', 'Cat 3'],
              contractType: 'Contract Type',
              referralCreatedAt: '2024-09-10T12:10:12',
              referralSentAt: '2024-08-31T20:09:56',
              interventionTitle: 'Intervention Title',
              referringOfficer: 'A Officer',
              responsibleOfficer: 'Another Officer',
              serviceProviderUser: 'A User',
              serviceProviderLocation: 'Leeds',
              serviceProviderName: 'The service provider',
              draft: false,
            },
          ],
          message: 'Referral message',
        },
      ],
    })

    const getAccommodationSpy = jest.spyOn(rpService, 'getAccommodation').mockResolvedValue({
      referralDate: '2023-09-07T15:09:43',
      provider: 'The provider',
      team: 'Team 1',
      officer: {
        forename: 'John',
        surname: 'Williams',
      },
      status: 'IN_PROGRESS',
      startDateTime: '2023-11-01T12:45:01',
      notes: 'Some notes',
      mainAddress: '123 Main Street',
      message: 'A message',
    })

    const getAssessmentInformationSpy = jest.spyOn(rpService, 'getAssessmentInformation').mockResolvedValue({
      originalAssessment: {
        assessmentType: 'RESETTLEMENT_PLAN',
        lastUpdated: '2024-09-07T15:09:43',
        updatedBy: 'A User',
        questionsAndAnswers: [
          {
            questionTitle: 'This is a question',
            answer: 'An answer',
            originalPageId: 'PAGE_1',
          },
          {
            questionTitle: 'This is another question',
            answer: 'Answer1\nAnswer2\nAnswer3',
            originalPageId: 'PAGE_2',
          },
        ],
      },
      latestAssessment: {
        assessmentType: 'BCST2',
        lastUpdated: '2024-09-02T07:00:06',
        updatedBy: 'A User',
        questionsAndAnswers: [
          {
            questionTitle: 'This is a question',
            answer: 'Another answer',
            originalPageId: 'PAGE_1',
          },
          {
            questionTitle: 'This is another question',
            answer: 'Answer1\nAnswer2\nAnswer3',
            originalPageId: 'PAGE_2',
          },
        ],
      },
    })

    const getCaseNotesHistorySpy = jest.spyOn(rpService, 'getCaseNotesHistory').mockResolvedValue({
      results: {
        content: [
          {
            caseNoteId: '123',
            pathway: 'ACCOMMODATION',
            creationDateTime: '2024-09-07T15:09:43',
            occurenceDateTime: '2024-09-07T15:09:43',
            createdBy: 'A User',
            text: 'This is a case note',
          },
          {
            caseNoteId: '456',
            pathway: 'ACCOMMODATION',
            creationDateTime: '2024-09-07T15:09:43',
            occurenceDateTime: '2024-09-07T15:09:43',
            createdBy: 'A User',
            text: 'This is another case note',
          },
        ],
        pageSize: 5,
        page: 0,
        sortName: '',
        totalElements: 2,
        last: true,
      },
    })

    const getCaseNotesCreatorsSpy = jest.spyOn(rpService, 'getCaseNotesCreators').mockResolvedValue({
      results: [
        {
          createdBy: 'A User',
          userId: 'A_USER',
        },
      ],
    })

    await request(app)
      .get('/accommodation?prisonerNumber=123')
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())

    expect(getCrsReferralsSpy).toHaveBeenCalledWith('123', 'ACCOMMODATION')
    expect(getAccommodationSpy).toHaveBeenCalledWith('123')
    expect(getAssessmentInformationSpy).toHaveBeenCalledWith('123', 'ACCOMMODATION')
    expect(getCaseNotesHistorySpy).toHaveBeenCalledWith(
      '123',
      'ACCOMMODATION',
      '0',
      '10',
      '0',
      'occurenceDateTime%2CDESC',
      '0',
    )
    expect(getCaseNotesCreatorsSpy).toHaveBeenCalledWith('123', 'ACCOMMODATION')
  })
})

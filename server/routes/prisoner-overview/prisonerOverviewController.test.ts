import type { Express } from 'express'
import request from 'supertest'
import RpService from '../../services/rpService'
import { appWithAllRoutes } from '../testutils/appSetup'
import Config from '../../s3Config'
import FeatureFlags from '../../featureFlag'
import { configHelper } from '../configHelperTest'
import { stubPrisonerDetails } from '../testutils/testUtils'
import DocumentService from '../../services/documentService'

let app: Express
let rpService: jest.Mocked<RpService>
let documentService: jest.Mocked<DocumentService>
const config: jest.Mocked<Config> = new Config() as jest.Mocked<Config>
const featureFlags: jest.Mocked<FeatureFlags> = new FeatureFlags() as jest.Mocked<FeatureFlags>

beforeEach(() => {
  rpService = new RpService() as jest.Mocked<RpService>
  documentService = new DocumentService() as jest.Mocked<DocumentService>
  configHelper(config)

  app = appWithAllRoutes({
    services: {
      rpService,
      documentService,
    },
  })

  FeatureFlags.getInstance = jest.fn().mockReturnValue(featureFlags)

  stubPrisonerDetails(rpService)
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('prisonerOverview', () => {
  it('should not render page if prisonerData does not exist', async () => {
    await request(app)
      .get('/prisoner-overview')
      .expect(500)
      .expect(res => expect(res.text).toMatchSnapshot())
  })

  it('happy path with default query parameters', async () => {
    const getPrisonerOverviewPageDataSpy = jest.spyOn(rpService, 'getPrisonerOverviewPageData').mockResolvedValue([
      {
        licenceId: 101,
        status: 'ACTIVE',
        startDate: '20/08/2023',
        expiryDate: '12/07/2024',
        standardLicenceConditions: [
          {
            id: 1001,
            image: false,
            text: 'Be of good behaviour and not behave in a way which undermines the purpose of the licence period.',
            sequence: 0,
          },
          {
            id: 1002,
            image: false,
            text: 'Not commit any offence.',
            sequence: 1,
          },
          {
            id: 1003,
            image: false,
            text: 'Keep in touch with the supervising officer in accordance with instructions given by the supervising officer.',
            sequence: 2,
          },
        ],
        otherLicenseConditions: [
          {
            id: 1007,
            image: false,
            text: 'You must reside overnight within Greater Manchester probation region while of no fixed abode, unless otherwise approved by your supervising officer.',
            sequence: 0,
          },
          {
            id: 1008,
            image: true,
            text: 'Not to enter the area of Leeds City Centre, as defined by the attached map, without the prior approval of your supervising officer.',
            sequence: 7,
          },
          {
            id: 1009,
            image: false,
            text: 'Report to staff at Victoria Park Probation Centre at 10:30am daily, unless otherwise authorised by your supervising officer. This condition will be reviewed by your supervising officer on a monthly basis and may be amended or removed if it is felt that the level of risk you present has reduced appropriately.',
            sequence: 8,
          },
          {
            id: 1010,
            image: false,
            text: 'Attend a location, as required by your supervising officer, to give a sample of oral fluid / urine in order to test whether you have any specified Class A and specified Class B drugs in your body, for the purpose of ensuring that you are complying with the condition of your licence requiring you to be of good behaviour. Do not take any action that could hamper or frustrate the drug testing process.',
            sequence: 12,
          },
          {
            id: 1011,
            image: false,
            text: 'Allow person(s) as designated by your supervising officer to install an electronic monitoring tag on you and access to install any associated equipment in your property, and for the purpose of ensuring that equipment is functioning correctly. You must not damage or tamper with these devices and ensure that the tag is charged, and report to your supervising officer and the EM provider immediately if the tag or the associated equipment are not working correctly. This will be for the purpose of monitoring your freedom of movement licence condition(s) unless otherwise authorised by your supervising officer.',
            sequence: 13,
          },
          {
            id: 1012,
            image: false,
            text: 'You will be subject to trail monitoring. Your whereabouts will be electronically monitored by GPS Satellite Tagging, ending on 08 November 2024, and you must cooperate with the monitoring as directed by your supervising officer unless otherwise authorised by your supervising officer.',
            sequence: 14,
          },
          {
            id: 1013,
            image: false,
            text: 'You must let the police search you if they ask. You must also let them search a vehicle you are with, like a car or a motorbike.',
            sequence: 15,
          },
        ],
      },
      {
        completedDate: '2023-07-29T03:07:38',
        assessmentStatus: 'Complete',
        groupReconvictionScore: {
          oneYear: 10,
          twoYears: 20,
          scoreLevel: 'LOW',
        },
        violencePredictorScore: {
          ovpStaticWeightedScore: 2,
          ovpDynamicWeightedScore: 3,
          ovpTotalWeightedScore: 4,
          oneYear: 12,
          twoYears: 13,
          ovpRisk: 'LOW',
        },
        generalPredictorScore: {
          ogpStaticWeightedScore: 40,
          ogpDynamicWeightedScore: 50,
          ogpTotalWeightedScore: 60,
          ogp1Year: 20,
          ogp2Year: 30,
          ogpRisk: 'HIGH',
        },
        riskOfSeriousRecidivismScore: {
          percentageScore: 4,
          staticOrDynamic: 'STATIC',
          scoreLevel: 'LOW',
        },
        sexualPredictorScore: {
          ospIndecentPercentageScore: 50,
          ospContactPercentageScore: 78,
          ospIndecentScoreLevel: 'MEDIUM',
          ospContactScoreLevel: 'MEDIUM',
        },
      },
      {
        riskInCommunity: {
          CHILDREN: 'HIGH',
          PUBLIC: 'HIGH',
          KNOWN_ADULT: 'HIGH',
          STAFF: 'MEDIUM',
          PRISONERS: 'LOW',
        },
        overallRiskLevel: 'HIGH',
        assessedOn: '2023-07-29T03:07:38',
      },
      {
        level: 1,
        levelDescription: 'MAPPA Level 1',
        category: 3,
        categoryDescription: 'MAPPA Cat 3',
        startDate: '2023-01-27',
        reviewDate: '2023-04-27',
      },
      {
        content: [
          {
            caseNoteId: '47042895',
            pathway: 'FINANCE_AND_ID',
            creationDateTime: '2024-04-22T13:04:48.830934401',
            occurenceDateTime: '2024-04-22T13:04:48',
            createdBy: 'Test user 3',
            text: 'Resettlement status set to: Support declined. test',
          },
          {
            caseNoteId: '47042894',
            pathway: 'ACCOMMODATION',
            creationDateTime: '2024-04-22T11:46:23.938154822',
            occurenceDateTime: '2024-04-22T11:46:23',
            createdBy: 'Secondname, Firstname',
            text: 'Resettlement status set to: Support required. Updating the status to support required.',
          },
          {
            caseNoteId: '47042797',
            pathway: 'HEALTH',
            creationDateTime: '2024-04-19T17:07:18.65377525',
            occurenceDateTime: '2024-04-19T17:07:18',
            createdBy: 'Test user',
            text: 'Resettlement status set to: Support not required. redirecting test',
          },
          {
            caseNoteId: '47042713',
            pathway: 'FINANCE_AND_ID',
            creationDateTime: '2024-04-19T11:46:39.223032337',
            occurenceDateTime: '2024-04-19T11:46:39',
            createdBy: 'Test user',
            text: 'Resettlement status set to: In progress. redirected to pathway page',
          },
          {
            caseNoteId: '47042712',
            pathway: 'EDUCATION_SKILLS_AND_WORK',
            creationDateTime: '2024-04-19T11:44:25.138323422',
            occurenceDateTime: '2024-04-19T11:44:25',
            createdBy: 'Test user',
            text: 'Resettlement status set to: In progress. testing redirect to individual pathway...',
          },
          {
            caseNoteId: '47042711',
            pathway: 'FINANCE_AND_ID',
            creationDateTime: '2024-04-19T11:43:31.210144848',
            occurenceDateTime: '2024-04-19T11:43:31',
            createdBy: 'Test user',
            text: 'Resettlement status set to: Done. testing redirect form to pathway...',
          },
          {
            caseNoteId: '47042710',
            pathway: 'ATTITUDES_THINKING_AND_BEHAVIOUR',
            creationDateTime: '2024-04-19T11:42:56.548023528',
            occurenceDateTime: '2024-04-19T11:42:56',
            createdBy: 'Test user',
            text: 'Resettlement status set to: In progress. test update redirect',
          },
          {
            caseNoteId: '47042709',
            pathway: 'ATTITUDES_THINKING_AND_BEHAVIOUR',
            creationDateTime: '2024-04-19T11:41:59.618590394',
            occurenceDateTime: '2024-04-19T11:41:59',
            createdBy: 'Test user',
            text: 'Resettlement status set to: Done. form submit redirect to pathway',
          },
          {
            primaryPom: {
              name: 'David Jones',
            },
            secondaryPom: {
              name: 'Barbara Winter',
            },
            com: {
              name: 'John Doe',
            },
            keyWorker: {
              name: 'Steve Rendell',
            },
            results: [
              {
                title: 'Appointment with Charity ABC',
                contact: 'Bob Example',
                date: '2024-10-31',
                time: '15:18:40',
                location: {
                  buildingName: '',
                  buildingNumber: '',
                  streetName: '',
                  district: '',
                  town: '',
                  county: 'Swansea',
                  postcode: 'SA1 1JG',
                  description: null,
                },
                contactEmail: 'charity@test.com',
                duration: 30,
                note: null,
                type: 'CRSSAA',
              },
              {
                title: 'Appointment with Jobs centre plus',
                contact: 'CRSUATU Staff',
                date: '2024-11-01',
                time: '15:18:40',
                location: {
                  buildingName: '',
                  buildingNumber: 'Unit 7',
                  streetName: 'Parc Tawe North',
                  district: '',
                  town: 'Swansea',
                  county: 'Swansea',
                  postcode: 'SA1 2AA',
                  description: null,
                },
                contactEmail: 'CRSUATU.staff@test.com',
                duration: 60,
                note: null,
                type: 'CRSSAA',
              },
              {
                title: 'Accommodation Services - North West',
                contact: 'Not provided',
                date: '2024-11-01',
                time: '15:18:40',
                location: {
                  buildingName: null,
                  buildingNumber: '9',
                  streetName: 'Downing Street',
                  district: null,
                  town: 'Gwent',
                  county: 'The Forward Trust',
                  postcode: 'S1 2NP',
                  description: null,
                },
                contactEmail: null,
                duration: 60,
                note: null,
                type: '',
              },
            ],
          },
        ],
      },
    ])

    const getDocumentMetaSpy = jest.spyOn(documentService, 'getDocumentMeta').mockResolvedValue([
      {
        id: 1,
        fileName: 'SampleLicenceConditions.docx',
        creationDate: new Date('2024-10-29T12:33:16.78145'),
        category: 'LICENCE_CONDITIONS',
      },
    ])

    await request(app)
      .get('/prisoner-overview?prisonerNumber=123')
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
    expect(getPrisonerOverviewPageDataSpy).toHaveBeenCalledWith('0', '10', 'occurenceDateTime%2CDESC', '0', 'All')
    expect(getDocumentMetaSpy).toHaveBeenCalledWith('123')
  })

  it('should render the prisoner overview page with correct query params', async () => {
    const queryParams = {
      page: '1',
      size: '5',
      sort: 'occurenceDateTime,DESC',
      days: '7',
      selectedPathway: 'Education',
    }

    await request(app)
      .get('/prisoner-overview')
      .query(queryParams)
      .expect(200)
      .expect(res => {
        // Verify that the response contains the expected prisoner number and query params data
        expect(res.text).toContain('123')
        expect(res.text).toContain(queryParams.page)
        expect(res.text).toContain(queryParams.size)
        expect(res.text).toContain(queryParams.sort)
        expect(res.text).toContain(queryParams.days)
        expect(res.text).toContain(queryParams.selectedPathway)
      })
  })
})

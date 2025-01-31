import { JSDOM } from 'jsdom'
import supertest from 'supertest'
import { PrisonerData } from '../../@types/express'
import RpService from '../../services/rpService'
import { PrisonersList } from '../../data/model/prisoners'
import FeatureFlags from '../../featureFlag'

export function stubPrisonerDetails(rpService: RpService, releaseDate: string = null, dateOfBirth: string = null) {
  jest.spyOn(rpService, 'getPrisonerDetails').mockResolvedValue({
    personalDetails: {
      prisonerNumber: 'A1234DY',
      prisonId: 'MDI',
      facialImageId: '456',
      firstName: 'John',
      lastName: 'Smith',
      releaseDate,
      dateOfBirth,
    },
    pathways: [
      {
        pathway: 'ACCOMMODATION',
        status: 'IN_PROGRESS',
      },
      {
        pathway: 'ATTITUDES_THINKING_AND_BEHAVIOUR',
        status: 'IN_PROGRESS',
      },
      {
        pathway: 'CHILDREN_FAMILIES_AND_COMMUNITY',
        status: 'IN_PROGRESS',
      },
      {
        pathway: 'DRUGS_AND_ALCOHOL',
        status: 'IN_PROGRESS',
      },
      {
        pathway: 'EDUCATION_SKILLS_AND_WORK',
        status: 'IN_PROGRESS',
      },
      {
        pathway: 'FINANCE_AND_ID',
        status: 'IN_PROGRESS',
      },
      {
        pathway: 'HEALTH',
        status: 'IN_PROGRESS',
      },
    ],
  } as PrisonerData)
}

export function stubPrisonersList(rpService: RpService) {
  const prisonerList: PrisonersList = {
    content: [
      {
        prisonerNumber: 'G9808UX',
        firstName: 'CASEY',
        middleNames: 'AMARAWN',
        lastName: 'CHAVAN',
        releaseDate: '2024-11-30',
        releaseType: 'CRD',
        lastUpdatedDate: null,
        status: [
          {
            pathway: 'ACCOMMODATION',
            status: 'NOT_STARTED',
            lastDateChange: null,
          },
          {
            pathway: 'ATTITUDES_THINKING_AND_BEHAVIOUR',
            status: 'NOT_STARTED',
            lastDateChange: null,
          },
          {
            pathway: 'CHILDREN_FAMILIES_AND_COMMUNITY',
            status: 'NOT_STARTED',
            lastDateChange: null,
          },
          {
            pathway: 'DRUGS_AND_ALCOHOL',
            status: 'NOT_STARTED',
            lastDateChange: null,
          },
          {
            pathway: 'EDUCATION_SKILLS_AND_WORK',
            status: 'NOT_STARTED',
            lastDateChange: null,
          },
          {
            pathway: 'FINANCE_AND_ID',
            status: 'NOT_STARTED',
            lastDateChange: null,
          },
          {
            pathway: 'HEALTH',
            status: 'NOT_STARTED',
            lastDateChange: null,
          },
        ],
        pathwayStatus: null,
        homeDetentionCurfewEligibilityDate: null,
        paroleEligibilityDate: null,
        releaseEligibilityDate: null,
        releaseEligibilityType: null,
        releaseOnTemporaryLicenceDate: null,
        assessmentRequired: true,
      },
    ],
    pageSize: 10,
    page: 0,
    sortName: 'releaseDate,ASC',
    totalElements: 92,
    last: false,
  }
  return jest.spyOn(rpService, 'getListOfPrisoners').mockResolvedValue(prisonerList)
}

export function stubPrisonersCasesList(rpService: RpService) {
  const prisonerList: PrisonersList = {
    content: [
      {
        prisonerNumber: 'G9808UX',
        firstName: 'CASEY',
        middleNames: 'AMARAWN',
        lastName: 'CHAVAN',
        releaseDate: '2024-11-30',
        releaseType: 'CRD',
        lastUpdatedDate: null,
        status: [
          {
            pathway: 'ACCOMMODATION',
            status: 'NOT_STARTED',
            lastDateChange: null,
          },
          {
            pathway: 'ATTITUDES_THINKING_AND_BEHAVIOUR',
            status: 'NOT_STARTED',
            lastDateChange: null,
          },
          {
            pathway: 'CHILDREN_FAMILIES_AND_COMMUNITY',
            status: 'NOT_STARTED',
            lastDateChange: null,
          },
          {
            pathway: 'DRUGS_AND_ALCOHOL',
            status: 'NOT_STARTED',
            lastDateChange: null,
          },
          {
            pathway: 'EDUCATION_SKILLS_AND_WORK',
            status: 'NOT_STARTED',
            lastDateChange: null,
          },
          {
            pathway: 'FINANCE_AND_ID',
            status: 'NOT_STARTED',
            lastDateChange: null,
          },
          {
            pathway: 'HEALTH',
            status: 'NOT_STARTED',
            lastDateChange: null,
          },
        ],
        pathwayStatus: null,
        homeDetentionCurfewEligibilityDate: null,
        paroleEligibilityDate: null,
        releaseEligibilityDate: null,
        releaseEligibilityType: null,
        releaseOnTemporaryLicenceDate: null,
        assessmentRequired: true,
        assignedWorkerFirstname: null,
        assignedWorkerLastname: null,
      },
    ],
    pageSize: 10,
    page: 0,
    sortName: 'releaseDate,ASC',
    totalElements: 92,
    last: false,
  }
  return jest.spyOn(rpService, 'getListOfPrisoners').mockResolvedValue(prisonerList)
}

export function sanitiseStackTrace(html: string) {
  return html.replaceAll(/at .*/g, 'at /')
}

export function stubAccommodation(rpService: RpService) {
  return jest.spyOn(rpService, 'getAccommodation').mockResolvedValue({
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
}

export function stubCrsReferrals(rpService: RpService, pathway: string) {
  return jest.spyOn(rpService, 'getCrsReferrals').mockResolvedValue({
    results: [
      {
        pathway,
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
}

export function stubPathwaySupportNeedsSummary(rpService: RpService, pathway: string) {
  return jest.spyOn(rpService, 'getPathwaySupportNeedsSummary').mockResolvedValue({
    prisonerNeeds: [
      {
        id: '1456',
        title: 'Cancel a tenancy',
        isPrisonResponsible: true,
        isProbationResponsible: false,
        status: 'NOT_STARTED',
        numberOfUpdates: 2,
        lastUpdated: '2024-09-12',
      },
      {
        id: '2894',
        title: 'Another support need',
        isPrisonResponsible: true,
        isProbationResponsible: true,
        status: 'IN_PROGRESS',
        numberOfUpdates: 4,
        lastUpdated: '2023-01-11',
      },
      {
        id: '9876',
        title: 'Declined support',
        isPrisonResponsible: false,
        isProbationResponsible: true,
        status: 'DECLINED',
        numberOfUpdates: 4,
        lastUpdated: '2023-01-11',
      },
      {
        id: '1234',
        title: 'Final support need',
        isPrisonResponsible: false,
        isProbationResponsible: false,
        status: 'MET',
        numberOfUpdates: 4,
        lastUpdated: '2023-01-11',
      },
    ],
  })
}

export function stubAssessmentInformation(rpService: RpService) {
  return jest.spyOn(rpService, 'getAssessmentInformation').mockResolvedValue({
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
}

export function stubCaseNotesHistory(rpService: RpService, pathway: string) {
  return jest.spyOn(rpService, 'getCaseNotesHistory').mockResolvedValue({
    results: {
      content: [
        {
          caseNoteId: '123',
          pathway,
          creationDateTime: '2024-09-07T15:09:43',
          occurenceDateTime: '2024-09-07T15:09:43',
          createdBy: 'A User',
          text: 'This is a case note',
        },
        {
          caseNoteId: '456',
          pathway,
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
}

export function stubCaseNotesCreators(rpService: RpService) {
  return jest.spyOn(rpService, 'getCaseNotesCreators').mockResolvedValue({
    results: [
      {
        createdBy: 'A User',
        userId: 'A_USER',
      },
    ],
  })
}

export function stubRpServiceNoData(rpService: RpService, method: keyof RpService) {
  return jest.spyOn(rpService, method).mockResolvedValue({ error: 'No data found' })
}

export function stubRpServiceThrowError(rpService: RpService, method: keyof RpService) {
  return jest.spyOn(rpService, method).mockRejectedValue(new Error('Something went wrong'))
}

export function stubEducationSkillsWork(rpService: RpService) {
  return jest.spyOn(rpService, 'getEducationSkillsWork').mockResolvedValue({
    workReadinessStatus: 'In progress',
    workReadinessStatusLastUpdated: '2024-09-05',
  })
}

export function stubFetchFinance(rpService: RpService) {
  return jest.spyOn(rpService, 'fetchFinance').mockResolvedValue({
    id: 12,
    logs: [
      { status: 'In progress', changeDate: '2024-09-09T12:21:45' },
      { status: 'Accepted', changeDate: '2024-09-10T14:45:02' },
    ],
    applicationSubmittedDate: '2024-09-08T09:00:03',
    currentStatus: 'Accepted',
    bankName: 'Natwest',
    bankResponseDate: '2024-09-10T14:45:02',
    isAddedToPersonalItems: true,
    addedToPersonalItemsDate: '2024-09-12T16:03:12',
  })
}

export function stubFetchId(rpService: RpService) {
  return jest.spyOn(rpService, 'fetchId').mockResolvedValue({
    results: [
      {
        id: 13,
        idType: {
          name: 'Birth certificate',
        },
        applicationSubmittedDate: '2024-09-12T14:45:02',
        isPriorityApplication: true,
        costOfApplication: 12,
        refundAmount: null,
        haveGro: false,
        isUkNationalBornOverseas: false,
        countryBornIn: null,
        caseNumber: '1245',
        courtDetails: 'detail',
        driversLicenceType: null,
        driversLicenceApplicationMadeAt: null,
        isAddedToPersonalItems: true,
        addedToPersonalItemsDate: '2024-09-13T14:45:02',
        status: 'complete',
        dateIdReceived: '2024-09-13T12:45:02',
      },
      {
        id: 17,
        idType: {
          name: 'Driving licence',
        },
        applicationSubmittedDate: '2024-09-12T14:45:02',
        isPriorityApplication: false,
        costOfApplication: 45,
        refundAmount: 12,
        haveGro: true,
        isUkNationalBornOverseas: true,
        countryBornIn: 'Andorra',
        caseNumber: '7891',
        courtDetails: 'detail',
        driversLicenceType: 'Full',
        driversLicenceApplicationMadeAt: '2024-09-12T14:45:02',
        isAddedToPersonalItems: false,
        addedToPersonalItemsDate: null,
        status: 'rejected',
        dateIdReceived: null,
      },
    ],
  })
}

export function stubPrisonerOverviewData(rpService: RpService) {
  return jest.spyOn(rpService, 'getPrisonerOverviewPageData').mockReturnValue([
    Promise.resolve({
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
    }),
    Promise.resolve({
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
    }),
    Promise.resolve({
      riskInCommunity: {
        CHILDREN: 'HIGH',
        PUBLIC: 'HIGH',
        KNOWN_ADULT: 'HIGH',
        STAFF: 'MEDIUM',
        PRISONERS: 'LOW',
      },
      overallRiskLevel: 'HIGH',
      assessedOn: '2023-07-29T03:07:38',
    }),
    Promise.resolve({
      level: 1,
      levelDescription: 'MAPPA Level 1',
      category: 3,
      categoryDescription: 'MAPPA Cat 3',
      startDate: '2023-01-27',
      reviewDate: '2023-04-27',
    }),
    Promise.resolve({
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
      ],
    }),
    Promise.resolve({
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
      resettlementWorker: {
        name: 'Pso Lastname',
      },
    }),
    Promise.resolve([
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
    ]),
  ])
}

export function stubNoPrisonersList(rpService: RpService) {
  const prisonerList: PrisonersList = {
    content: [],
    pageSize: 10,
    page: 0,
    sortName: 'releaseDate,ASC',
    totalElements: 0,
    last: true,
  }
  return jest.spyOn(rpService, 'getListOfPrisoners').mockResolvedValue(prisonerList)
}
export function parseHtmlDocument(documentText: string): Document {
  const { document } = new JSDOM(documentText).window
  return document
}

export function pageHeading(document: Document): string {
  return document.querySelector('[data-qa="page-heading"]')?.textContent
}

export function expectSomethingWentWrongPage(res: supertest.Response) {
  const document = parseHtmlDocument(res.text)
  expect(pageHeading(document)).toEqual('Something went wrong')
}

export function expectPrisonerNotFoundPage(res: supertest.Response) {
  const document = parseHtmlDocument(res.text)
  expect(pageHeading(document)).toEqual('No data found for prisoner')
}

export function redirectedToPath(res: supertest.Response): string {
  return res.headers.location
}

export function stubFeatureFlagToFalse(featureFlags: FeatureFlags) {
  jest.spyOn(featureFlags, 'getFeatureFlag').mockImplementation(() => false)
}

export function stubFeatureFlagToTrue(featureFlags: FeatureFlags, flagsToMock: string[]) {
  jest.spyOn(featureFlags, 'getFeatureFlag').mockImplementation((flag: string) => {
    return flagsToMock.includes(flag)
  })
}

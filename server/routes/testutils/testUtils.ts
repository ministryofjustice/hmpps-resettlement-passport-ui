import { PrisonerData } from '../../@types/express'
import RpService from '../../services/rpService'

export function stubPrisonerDetails(rpService: RpService, releaseDate: string = null) {
  jest.spyOn(rpService, 'getPrisonerDetails').mockResolvedValue({
    personalDetails: {
      prisonerNumber: '123',
      facialImageId: '456',
      firstName: 'John',
      lastName: 'Smith',
      releaseDate,
    },
    pathways: [
      {
        pathway: 'ACCOMMODATION',
        status: 'IN_PROGRESS',
      },
    ],
  } as PrisonerData)
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

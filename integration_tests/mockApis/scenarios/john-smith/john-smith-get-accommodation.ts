import { stubFor } from '../../wiremock'
import { responseHeaders } from '../../headers'

const getAccommodation = () => {
  return stubFor({
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/accommodation',
      method: 'GET',
    },
    response: {
      status: 200,
      headers: responseHeaders,
      jsonBody: {
        referralDate: '2023-09-08',
        provider: 'London',
        team: 'Unallocated Team(N07)',
        officer: {
          forename: 'Unallocated Staff(N07)',
          surname: 'Staff',
          middlename: null,
        },
        status: 'Initiated',
        startDateTime: '2022-09-18T14:46:00',
        notes: 'New Notes',
        mainAddress: 'Old Court, 10, Old Street, Old District, Old Town, Old County, LS2',
        message: null,
      },
    },
    scenarioName: 'john-smith-accommodation-get-accommodation',
    requiredScenarioState: 'Started',
  })
}

const getAccommodationAssessment = () => {
  return stubFor({
    name: 'John Smith get accommodation assessment',
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/ACCOMMODATION/latest',
      method: 'GET',
    },
    response: {
      status: 200,
      headers: responseHeaders,
      jsonBody: {
        latestAssessment: {
          assessmentType: 'BCST2',
          lastUpdated: '2024-04-08T14:34:19.458378',
          questionsAndAnswers: [
            {
              answer: 'No',
              originalPageId: 'SINGLE_QUESTION_ON_A_PAGE',
              questionTitle: 'Single question on a page This is a radio Question?',
            },
            {
              answer: 'Yes',
              originalPageId: 'MULTIPLE_QUESTIONS_ON_A_PAGE',
              questionTitle: 'Multiple questions on a page Radio question with regex validation?',
            },
            {
              answer: '4',
              originalPageId: 'MULTIPLE_QUESTIONS_ON_A_PAGE',
              questionTitle: 'Number Regex',
            },
            {
              answer: '123 Main Street, AB1 2BC',
              originalPageId: 'MULTIPLE_QUESTIONS_ON_A_PAGE',
              questionTitle: 'Address question: Enter the address',
            },
            {
              answer: 'Yes',
              originalPageId: 'MULTIPLE_QUESTIONS_ON_A_PAGE',
              questionTitle: 'Nested Radio question types?',
            },
            {
              answer: 'Some short text',
              originalPageId: 'MULTIPLE_QUESTIONS_ON_A_PAGE',
              questionTitle: 'Short text nested',
            },
            {
              answer: '1 Main Street, BC1 2DE',
              originalPageId: 'MULTIPLE_QUESTIONS_ON_A_PAGE',
              questionTitle: 'Enter the address nested',
            },
            {
              answer: 'Some long text',
              originalPageId: 'MULTIPLE_QUESTIONS_ON_A_PAGE',
              questionTitle: 'Long text nested',
            },
            {
              answer: 'Initial text',
              originalPageId: 'MULTIPLE_QUESTIONS_ON_A_PAGE',
              questionTitle: 'Long Text Question',
            },
            {
              answer: 'No benefits',
              originalPageId: 'MULTIPLE_QUESTIONS_ON_A_PAGE',
              questionTitle: 'Checkbox question with exclusive options?',
            },
            {
              answer: 'Yes',
              originalPageId: 'DIVERGENT_FLOW_OPTIONS',
              questionTitle: 'Divergent flow options yes for divergent flow?',
            },
            {
              answer: 'No answer provided',
              originalPageId: 'DIVERGENT_OPTION',
              questionTitle: 'Divergent option route?',
            },
            {
              answer: 'Support not required',
              originalPageId: 'MANDATORY_AND_OPTIONAL_QUESTIONS',
              questionTitle: 'Mandatory question status',
            },
            {
              answer: 'Move to a new address',
              originalPageId: 'MANDATORY_AND_OPTIONAL_QUESTIONS',
              questionTitle: 'This is an optional question to enter address select move to new address?',
            },
            {
              answer: '1 Main Street, BC1 2DE',
              originalPageId: 'MANDATORY_AND_OPTIONAL_QUESTIONS',
              questionTitle: 'Optional Question enter address?',
            },
          ],
          updatedBy: 'Simon Turner',
        },
        originalAssessment: null,
      },
    },
  })
}

const getAccommodationCaseNotes = () => {
  return stubFor({
    name: 'Get John Smith Accommodation Case Notes',
    request: {
      url: '/rpApi/resettlement-passport/case-notes/A8731DY?page=0&size=10&sort=occurenceDateTime%2CDESC&days=0&pathwayType=ACCOMMODATION&createdByUserId=0',
      method: 'GET',
    },
    response: {
      status: 200,
      headers: responseHeaders,
      jsonBody: {
        content: [
          {
            caseNoteId: '47041350',
            pathway: 'ACCOMMODATION',
            creationDateTime: '2024-04-02T18:07:16.82079488',
            occurenceDateTime: '2024-04-02T18:07:16',
            createdBy: 'Boobier, James',
            text: 'Resettlement status set to: Done. This is a test,',
          },
        ],
        pageSize: 10,
        page: 0,
        sortName: 'occurenceDateTime,DESC',
        totalElements: 364,
        last: false,
      },
    },
  })
}

const getAccommodationCaseNotesCreators = () => {
  return stubFor({
    name: 'Get John Smith Accommodation Case Notes Creators',
    request: {
      url: '/rpApi/resettlement-passport/case-notes/A8731DY/creators/ACCOMMODATION',
      method: 'GET',
    },
    response: {
      status: 200,
      headers: responseHeaders,
      jsonBody: [
        {
          createdBy: 'Johnson, Lucie',
          userId: '487735',
        },
        {
          createdBy: 'Boobier, James',
          userId: '487411',
        },
        {
          createdBy: 'Moshecorn, Akiva',
          userId: '487417',
        },
      ],
    },
  })
}

const getAccommodationCaseNotesCrsReferrals = () => {
  return stubFor({
    name: 'Get John Smith Accommodation CaseNotes Crs Referrals',
    request: {
      url: '/rpApi/resettlement-passport/case-notes/A8731DY/crs-referrals/ACCOMMODATION',
      method: 'GET',
    },
    response: {
      status: 200,
      headers: responseHeaders,
      jsonBody: {
        results: [
          {
            pathway: 'ACCOMMODATION',
            referrals: [
              {
                serviceCategories: ['Accommodation'],
                contractType: 'Accommodation',
                referralCreatedAt: '2023-10-27T12:24:54.711134',
                referralSentAt: '2023-10-27T12:24:54.711134',
                interventionTitle: 'Accommodation Services - South West',
                referringOfficer: 'R&MP Practitioner',
                responsibleOfficer: 'R&MP Practitioner',
                serviceProviderUser: 'R&MP Practitioner',
                serviceProviderLocation: 'Test',
                serviceProviderName: 'Accommodation Services Ltd',
                draft: false,
              },
            ],
            message: '',
          },
        ],
      },
    },
  })
}

const getAccommodationCrsReferrals = () => {
  return stubFor({
    name: 'Get John Smith Accommodation Crs Referrals',
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/crs-referrals/ACCOMMODATION',
      method: 'GET',
    },
    response: {
      status: 200,
      headers: responseHeaders,
      jsonBody: {
        results: [
          {
            pathway: 'ACCOMMODATION',
            referrals: [
              {
                serviceCategories: ['Accommodation'],
                contractType: 'Accommodation',
                referralCreatedAt: '2023-10-27T12:24:54.711134',
                referralSentAt: '2023-10-27T12:24:54.711134',
                interventionTitle: 'Accommodation Services - South West',
                referringOfficer: 'R&MP Practitioner',
                responsibleOfficer: 'R&MP Practitioner',
                serviceProviderUser: 'R&MP Practitioner',
                serviceProviderLocation: 'Test',
                serviceProviderName: 'Accommodation Services Ltd',
                draft: false,
              },
            ],
            message: '',
          },
        ],
      },
    },
  })
}

export const johnSmithGetAccommodation = () => [
  getAccommodation(),
  getAccommodationAssessment(),
  getAccommodationCaseNotes(),
  getAccommodationCaseNotesCreators(),
  getAccommodationCaseNotesCrsReferrals(),
  getAccommodationCrsReferrals(),
]

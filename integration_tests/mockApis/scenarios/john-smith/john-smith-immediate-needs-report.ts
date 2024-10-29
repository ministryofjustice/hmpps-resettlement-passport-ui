import { SuperAgentRequest } from 'superagent'
import { addMonths, format } from 'date-fns'
import { stubFor } from '../../wiremock'
import { responseHeaders, submitHeaders } from '../../headers'
import { getResettlementAssessmentVersion } from './john-smith'
import { validateAssessment } from '../../common'

export const stubJohnSmithPrisonerDetails = () =>
  stubFor({
    name: 'JohnSmith immediate needs report Details',
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY',
      method: 'GET',
    },
    response: {
      headers: responseHeaders,
      status: 200,
      jsonBody: {
        personalDetails: {
          prisonerNumber: 'A8731DY',
          prisonId: 'MDI',
          firstName: 'John',
          middleNames: 'Michael',
          lastName: 'Smith',
          releaseDate: format(addMonths(new Date(), 6), 'yyyy-MM-dd'),
          releaseType: 'CRD',
          dateOfBirth: '1982-10-24',
          age: 41,
          location: 'K-3-011',
          facialImageId: '1313058',
        },
        pathways: [
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
          { pathway: 'FINANCE_AND_ID', status: 'NOT_STARTED', lastDateChange: null },
          {
            pathway: 'HEALTH',
            status: 'NOT_STARTED',
            lastDateChange: null,
          },
        ],
        assessmentRequired: true,
        resettlementReviewAvailable: false,
        immediateNeedsSubmitted: false,
        preReleaseSubmitted: false,
      },
    },
  })

const initialTaskList = () =>
  stubFor({
    name: 'JohnSmith immediate needs report Initial task list',
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/summary?assessmentType=BCST2',
      method: 'GET',
    },
    response: {
      status: 200,
      headers: responseHeaders,
      jsonBody: [
        { pathway: 'ACCOMMODATION', assessmentStatus: 'NOT_STARTED' },
        { pathway: 'ATTITUDES_THINKING_AND_BEHAVIOUR', assessmentStatus: 'NOT_STARTED' },
        { pathway: 'CHILDREN_FAMILIES_AND_COMMUNITY', assessmentStatus: 'NOT_STARTED' },
        { pathway: 'DRUGS_AND_ALCOHOL', assessmentStatus: 'NOT_STARTED' },
        { pathway: 'EDUCATION_SKILLS_AND_WORK', assessmentStatus: 'NOT_STARTED' },
        { pathway: 'FINANCE_AND_ID', assessmentStatus: 'NOT_STARTED' },
        { pathway: 'HEALTH', assessmentStatus: 'NOT_STARTED' },
      ],
    },
    scenarioName: 'john-smith-immediate-needs-report',
    requiredScenarioState: 'Started',
  })

const initialTaskListAllCompleteButHealth = () =>
  stubFor({
    name: 'JohnSmith immediate needs report Initial task list',
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/summary?assessmentType=BCST2',
      method: 'GET',
    },
    response: {
      status: 200,
      headers: responseHeaders,
      jsonBody: [
        { pathway: 'ACCOMMODATION', assessmentStatus: 'COMPLETE' },
        { pathway: 'ATTITUDES_THINKING_AND_BEHAVIOUR', assessmentStatus: 'COMPLETE' },
        { pathway: 'CHILDREN_FAMILIES_AND_COMMUNITY', assessmentStatus: 'COMPLETE' },
        { pathway: 'DRUGS_AND_ALCOHOL', assessmentStatus: 'COMPLETE' },
        { pathway: 'EDUCATION_SKILLS_AND_WORK', assessmentStatus: 'COMPLETE' },
        { pathway: 'FINANCE_AND_ID', assessmentStatus: 'COMPLETE' },
        { pathway: 'HEALTH', assessmentStatus: 'NOT_STARTED' },
      ],
    },
    scenarioName: 'john-smith-immediate-needs-report',
    requiredScenarioState: 'Started',
  })

const nextPageStartHealth = () =>
  stubFor({
    name: 'JohnSmith immediate needs report Health Assessment Next Page 1',
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/HEALTH/next-page?version=1&assessmentType=BCST2',
      method: 'POST',
      bodyPatterns: [
        {
          equalToJson: '{"questionsAndAnswers":[]}',
          ignoreArrayOrder: true,
          ignoreExtraElements: true,
        },
      ],
    },
    response: {
      status: 200,
      headers: responseHeaders,
      jsonBody: {
        nextPageId: 'REGISTERED_WITH_GP',
      },
    },
  })

const healthAssessment = () =>
  stubFor({
    name: 'John Smith immediate needs report Health Assessment',
    request: {
      method: 'GET',
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/HEALTH/page/REGISTERED_WITH_GP?assessmentType=BCST2&version=1',
    },
    response: {
      status: 200,
      headers: responseHeaders,
      jsonBody: {
        id: 'REGISTERED_WITH_GP',
        title: null,
        questionsAndAnswers: [
          {
            question: {
              '@class': 'ResettlementAssessmentResponseQuestion',
              id: 'REGISTERED_WITH_GP',
              title: 'Is the person in prison registered with a GP surgery outside of prison?',
              subTitle: null,
              type: 'RADIO',
              options: [
                { id: 'YES', displayText: 'Yes', description: null, exclusive: false },
                { id: 'NO', displayText: 'No', description: null, exclusive: false },
                { id: 'NO_ANSWER', displayText: 'No answer provided', description: null, exclusive: false },
              ],
              validationType: 'MANDATORY',
            },
            answer: null,
            originalPageId: 'REGISTERED_WITH_GP',
          },
          {
            question: {
              '@class': 'ResettlementAssessmentResponseQuestion',
              id: 'GP_PHONE_NUMBER',
              title: 'What is the phone number of the GP?',
              subTitle: null,
              type: 'SHORT_TEXT',
              validationType: 'MANDATORY',
              customValidation: {
                regex: '^\\d+$',
                message: 'Must be numerical',
              },
            },
            answer: null,
            originalPageId: 'REGISTERED_WITH_GP',
          },
        ],
      },
    },
  })

const nextPageHealth = () =>
  stubFor({
    name: 'JohnSmith immediate needs report Health Assessment Next Page Health',
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/HEALTH/next-page?version=1&assessmentType=BCST2&currentPage=REGISTERED_WITH_GP',
      method: 'POST',
      bodyPatterns: [
        {
          matchesJsonPath: {
            expression: '$.questionsAndAnswers[0].question',
            contains: 'REGISTERED_WITH_GP',
          },
        },
      ],
    },
    response: {
      status: 200,
      headers: responseHeaders,
      jsonBody: {
        nextPageId: 'MEET_HEALTHCARE_TEAM',
      },
    },
  })

const meetHealthCareTeamPage = () =>
  stubFor({
    name: 'John Smith Meet Health Care Team Page',
    request: {
      method: 'GET',
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/HEALTH/page/MEET_HEALTHCARE_TEAM?assessmentType=BCST2&version=1',
    },
    response: {
      status: 200,
      headers: responseHeaders,
      jsonBody: {
        id: 'MEET_HEALTHCARE_TEAM',
        title: null,
        questionsAndAnswers: [
          {
            question: {
              '@class': 'ResettlementAssessmentResponseQuestion',
              id: 'MEET_HEALTHCARE_TEAM',
              title: 'Does the person in prison want to meet with a prison healthcare team?',
              subTitle: null,
              type: 'RADIO',
              options: [
                { id: 'YES', displayText: 'Yes', description: null, exclusive: false },
                { id: 'NO', displayText: 'No', description: null, exclusive: false },
                { id: 'NO_ANSWER', displayText: 'No answer provided', description: null, exclusive: false },
              ],
              validationType: 'MANDATORY',
            },
            answer: null,
            originalPageId: 'MEET_HEALTHCARE_TEAM',
          },
        ],
      },
    },
  })

const nextPageHealthcareTeam = () =>
  stubFor({
    name: 'JohnSmith immediate needs report Health Assessment Next Page Healthcare Team Meeting',
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/HEALTH/next-page?version=1&assessmentType=BCST2&currentPage=MEET_HEALTHCARE_TEAM',
      method: 'POST',
      bodyPatterns: [
        {
          matchesJsonPath: {
            expression: '$.questionsAndAnswers[0].question',
            contains: 'MEET_HEALTHCARE_TEAM',
          },
        },
      ],
    },
    response: {
      status: 200,
      headers: responseHeaders,
      jsonBody: {
        nextPageId: 'SUPPORT_REQUIREMENTS',
      },
    },
  })

const supportRequirementsPage = () =>
  stubFor({
    name: 'John Smith Support requirements Page',
    request: {
      method: 'GET',
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/HEALTH/page/SUPPORT_REQUIREMENTS?assessmentType=BCST2&version=1',
    },
    response: {
      status: 200,
      headers: responseHeaders,
      jsonBody: {
        id: 'SUPPORT_REQUIREMENTS',
        title: null,
        questionsAndAnswers: [
          {
            question: {
              '@class': 'ResettlementAssessmentResponseQuestion',
              id: 'SUPPORT_REQUIREMENTS',
              title: 'Support needs',
              subTitle: null,
              type: 'CHECKBOX',
              options: [
                { id: 'NEED_1', displayText: 'Need 1', description: null, exclusive: false },
                { id: 'NEED_2', displayText: 'Need 2', description: null, exclusive: false },
                { id: 'NEED_3', displayText: 'Need 3', description: null, exclusive: false },
              ],
              validationType: 'MANDATORY',
            },
            answer: null,
            originalPageId: 'SUPPORT_REQUIREMENTS',
          },
        ],
      },
    },
  })

const supportRequirementsPageFreeText = () =>
  stubFor({
    name: 'John Smith Support requirements Page',
    request: {
      method: 'GET',
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/HEALTH/page/SUPPORT_REQUIREMENTS?assessmentType=BCST2&version=1',
    },
    response: {
      status: 200,
      headers: responseHeaders,
      jsonBody: {
        id: 'SUPPORT_REQUIREMENTS',
        title: null,
        questionsAndAnswers: [
          {
            question: {
              '@class': 'ResettlementAssessmentResponseQuestion',
              id: 'SUPPORT_REQUIREMENTS',
              title: 'Support needs',
              subTitle: null,
              type: 'CHECKBOX',
              options: [
                { id: 'NEED_1', displayText: 'Need 1', description: null, exclusive: false },
                { id: 'NEED_2', displayText: 'Need 2', description: null, exclusive: false },
                { id: 'NEED_3', displayText: 'Need 3', description: null, exclusive: false },
                {
                  id: 'OTHER_SUPPORT_NEEDS',
                  displayText: 'Other',
                  description: null,
                  exclusive: false,
                  freeText: true,
                },
              ],
              validationType: 'MANDATORY',
            },
            answer: null,
            originalPageId: 'SUPPORT_REQUIREMENTS',
          },
        ],
      },
    },
  })

const nextPageSupportRequirements = () =>
  stubFor({
    name: 'JohnSmith immediate needs report Health Assessment Next Page Support requirements',
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/HEALTH/next-page?version=1&assessmentType=BCST2&currentPage=SUPPORT_REQUIREMENTS',
      method: 'POST',
      bodyPatterns: [
        {
          matchesJsonPath: {
            expression: '$.questionsAndAnswers[0].question',
            contains: 'SUPPORT_REQUIREMENTS',
          },
        },
      ],
    },
    response: {
      status: 200,
      headers: responseHeaders,
      jsonBody: {
        nextPageId: 'ASSESSMENT_SUMMARY',
      },
    },
  })

const assessmentSummaryPage = (pathwayEnum: string, pathwayString: string) =>
  stubFor({
    name: 'John Smith immediate needs report Assessment Summary Page',
    request: {
      method: 'GET',
      url: `/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/${pathwayEnum}/page/ASSESSMENT_SUMMARY?assessmentType=BCST2&version=1`,
    },
    response: {
      status: 200,
      headers: responseHeaders,
      jsonBody: {
        id: 'ASSESSMENT_SUMMARY',
        title: `${pathwayString} report summary`,
        questionsAndAnswers: [
          {
            question: {
              '@class': 'ResettlementAssessmentResponseQuestion',
              id: 'SUPPORT_NEEDS',
              title: `${pathwayString} support needs`,
              subTitle: 'Select one option.',
              type: 'RADIO',
              options: [
                {
                  id: 'SUPPORT_REQUIRED',
                  displayText: 'Support required',
                  description: 'a need for support has been identified and is accepted',
                  exclusive: false,
                },
                {
                  id: 'SUPPORT_NOT_REQUIRED',
                  displayText: 'Support not required',
                  description: 'no need was identified',
                  exclusive: false,
                },
                {
                  id: 'SUPPORT_DECLINED',
                  displayText: 'Support declined',
                  description: 'a need has been identified but support is declined',
                  exclusive: false,
                },
              ],
              validationType: 'MANDATORY',
            },
            answer: null,
            originalPageId: 'ASSESSMENT_SUMMARY',
          },
          {
            question: {
              '@class': 'ResettlementAssessmentResponseQuestion',
              id: 'CASE_NOTE_SUMMARY',
              title: 'Add a case note summary',
              subTitle: 'This will be displayed as a case note in both DPS and nDelius',
              type: 'LONG_TEXT',
              options: null,
              validationType: 'MANDATORY',
            },
            answer: null,
            originalPageId: 'ASSESSMENT_SUMMARY',
          },
        ],
      },
    },
  })

const nextPageSummary = (pathway: string) =>
  stubFor({
    name: 'JohnSmith immediate needs report Next Page Summary',
    request: {
      url: `/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/${pathway}/next-page?version=1&assessmentType=BCST2&currentPage=ASSESSMENT_SUMMARY`,
      method: 'POST',
      bodyPatterns: [
        {
          matchesJsonPath: {
            expression: '$.questionsAndAnswers[1].question',
            contains: 'CASE_NOTE_SUMMARY',
          },
        },
      ],
    },
    response: {
      status: 200,
      headers: responseHeaders,
      jsonBody: {
        nextPageId: 'CHECK_ANSWERS',
      },
    },
  })

const checkAnswersPage = (pathway: string) =>
  stubFor({
    name: 'John Smith immediate needs report Check Answers Page',
    request: {
      method: 'GET',
      url: `/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/${pathway}/page/CHECK_ANSWERS?assessmentType=BCST2&version=1`,
    },
    response: {
      status: 200,
      headers: responseHeaders,
      jsonBody: {
        id: 'CHECK_ANSWERS',
        questionsAndAnswers: [],
        title: null,
      },
    },
  })

const submitAssessment = () => {
  return stubFor({
    name: 'JohnSmith immediate needs report Health Assessment Submit',
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/HEALTH/complete?assessmentType=BCST2',
      method: 'POST',
      bodyPatterns: [
        {
          equalToJson: JSON.stringify({
            questionsAndAnswers: [
              {
                answer: {
                  '@class': 'StringAnswer',
                  answer: 'YES',
                  displayText: 'Yes',
                },
                pageId: 'REGISTERED_WITH_GP',
                question: 'REGISTERED_WITH_GP',
                questionTitle: 'Is the person in prison registered with a GP surgery outside of prison?',
                questionType: 'RADIO',
              },
              {
                answer: {
                  '@class': 'StringAnswer',
                  answer: '01234567890',
                  displayText: '01234567890',
                },
                pageId: 'REGISTERED_WITH_GP',
                question: 'GP_PHONE_NUMBER',
                questionTitle: 'What is the phone number of the GP?',
                questionType: 'SHORT_TEXT',
              },
              {
                answer: {
                  '@class': 'StringAnswer',
                  answer: 'NO',
                  displayText: 'No',
                },
                pageId: 'MEET_HEALTHCARE_TEAM',
                question: 'MEET_HEALTHCARE_TEAM',
                questionTitle: 'Does the person in prison want to meet with a prison healthcare team?',
                questionType: 'RADIO',
              },
              {
                answer: {
                  '@class': 'ListAnswer',
                  answer: ['NEED_2'],
                  displayText: ['Need 2'],
                },
                pageId: 'SUPPORT_REQUIREMENTS',
                question: 'SUPPORT_REQUIREMENTS',
                questionTitle: 'Support needs',
                questionType: 'CHECKBOX',
              },
              {
                answer: {
                  '@class': 'StringAnswer',
                  answer: 'SUPPORT_NOT_REQUIRED',
                  displayText: 'Support not required',
                },
                pageId: 'ASSESSMENT_SUMMARY',
                question: 'SUPPORT_NEEDS',
                questionTitle: 'Health support needs',
                questionType: 'RADIO',
              },
              {
                answer: {
                  '@class': 'StringAnswer',
                  answer: 'Case Note',
                  displayText: 'Case Note',
                },
                pageId: 'ASSESSMENT_SUMMARY',
                question: 'CASE_NOTE_SUMMARY',
                questionTitle: 'Add a case note summary',
                questionType: 'LONG_TEXT',
              },
            ],
            version: 1,
          }),
          ignoreArrayOrder: true,
        },
      ],
    },
    response: {
      status: 200,
      headers: submitHeaders,
    },
    scenarioName: 'john-smith-immediate-needs-report',
    requiredScenarioState: 'Started',
    newScenarioState: 'After-Complete',
  })
}

const completeAssessmentHealthFreeText = () => {
  return stubFor({
    name: 'JohnSmith immediate needs report Health Assessment Submit',
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/HEALTH/complete?assessmentType=BCST2',
      method: 'POST',
      bodyPatterns: [
        {
          equalToJson: JSON.stringify({
            questionsAndAnswers: [
              {
                answer: {
                  '@class': 'StringAnswer',
                  answer: 'YES',
                  displayText: 'Yes',
                },
                pageId: 'REGISTERED_WITH_GP',
                question: 'REGISTERED_WITH_GP',
                questionTitle: 'Is the person in prison registered with a GP surgery outside of prison?',
                questionType: 'RADIO',
              },
              {
                answer: {
                  '@class': 'StringAnswer',
                  answer: '01234567890',
                  displayText: '01234567890',
                },
                pageId: 'REGISTERED_WITH_GP',
                question: 'GP_PHONE_NUMBER',
                questionTitle: 'What is the phone number of the GP?',
                questionType: 'SHORT_TEXT',
              },
              {
                answer: {
                  '@class': 'StringAnswer',
                  answer: 'NO',
                  displayText: 'No',
                },
                pageId: 'MEET_HEALTHCARE_TEAM',
                question: 'MEET_HEALTHCARE_TEAM',
                questionTitle: 'Does the person in prison want to meet with a prison healthcare team?',
                questionType: 'RADIO',
              },
              {
                answer: {
                  '@class': 'ListAnswer',
                  answer: ['NEED_2', 'OTHER_SUPPORT_NEEDS: Random text'],
                  displayText: ['Need 2'],
                },
                pageId: 'SUPPORT_REQUIREMENTS',
                question: 'SUPPORT_REQUIREMENTS',
                questionTitle: 'Support needs',
                questionType: 'CHECKBOX',
              },
              {
                answer: {
                  '@class': 'StringAnswer',
                  answer: 'SUPPORT_NOT_REQUIRED',
                  displayText: 'Support not required',
                },
                pageId: 'ASSESSMENT_SUMMARY',
                question: 'SUPPORT_NEEDS',
                questionTitle: 'Health support needs',
                questionType: 'RADIO',
              },
              {
                answer: {
                  '@class': 'StringAnswer',
                  answer: 'Case Note',
                  displayText: 'Case Note',
                },
                pageId: 'ASSESSMENT_SUMMARY',
                question: 'CASE_NOTE_SUMMARY',
                questionTitle: 'Add a case note summary',
                questionType: 'LONG_TEXT',
              },
            ],
            version: 1,
          }),
          ignoreArrayOrder: true,
        },
      ],
    },
    response: {
      status: 200,
      headers: submitHeaders,
    },
    scenarioName: 'john-smith-immediate-needs-report',
    requiredScenarioState: 'Started',
    newScenarioState: 'After-Complete',
  })
}

const completedTaskList = () =>
  stubFor({
    name: 'JohnSmith immediate needs report Completed task list',
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/summary?assessmentType=BCST2',
      method: 'GET',
    },
    response: {
      status: 200,
      headers: responseHeaders,
      jsonBody: [
        { pathway: 'ACCOMMODATION', assessmentStatus: 'COMPLETE' },
        { pathway: 'ATTITUDES_THINKING_AND_BEHAVIOUR', assessmentStatus: 'COMPLETE' },
        { pathway: 'CHILDREN_FAMILIES_AND_COMMUNITY', assessmentStatus: 'COMPLETE' },
        { pathway: 'DRUGS_AND_ALCOHOL', assessmentStatus: 'COMPLETE' },
        { pathway: 'EDUCATION_SKILLS_AND_WORK', assessmentStatus: 'COMPLETE' },
        { pathway: 'FINANCE_AND_ID', assessmentStatus: 'COMPLETE' },
        { pathway: 'HEALTH', assessmentStatus: 'COMPLETE' },
      ],
    },
    scenarioName: 'john-smith-immediate-needs-report',
    requiredScenarioState: 'After-Complete',
  })

const submit = () =>
  stubFor({
    name: 'John Smith immediate needs report Submit',
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/submit?assessmentType=BCST2&useNewDeliusCaseNoteFormat=true&useNewDpsCaseNoteFormat=true',
      method: 'POST',
    },
    response: {
      status: 200,
      headers: submitHeaders,
    },
  })

const nextPageStartAccommodation = () =>
  stubFor({
    name: 'JohnSmith immediate needs report Accommodation Assessment Next Page 1',
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/ACCOMMODATION/next-page?version=1&assessmentType=BCST2',
      method: 'POST',
      bodyPatterns: [
        {
          equalToJson: '{"questionsAndAnswers":[]}',
          ignoreArrayOrder: true,
          ignoreExtraElements: true,
        },
      ],
    },
    response: {
      status: 200,
      headers: responseHeaders,
      jsonBody: {
        nextPageId: 'WHERE_DID_THEY_LIVE',
      },
    },
  })

const whereDoTheyLivePage = () =>
  stubFor({
    name: 'John Smith Where Do They Live Page',
    request: {
      method: 'GET',
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/ACCOMMODATION/page/WHERE_DID_THEY_LIVE?assessmentType=BCST2&version=1',
    },
    response: {
      status: 200,
      headers: responseHeaders,
      jsonBody: {
        id: 'WHERE_DID_THEY_LIVE',
        title: null,
        questionsAndAnswers: [
          {
            question: {
              '@class': 'ResettlementAssessmentResponseQuestion',
              id: 'WHERE_DID_THEY_LIVE',
              title: 'Where did the person in prison live before custody?',
              subTitle: null,
              type: 'RADIO',
              options: [
                {
                  id: 'PRIVATE_RENTED_HOUSING',
                  displayText: 'Private rented housing',
                  description: null,
                  exclusive: false,
                },
                {
                  id: 'SOCIAL_HOUSING',
                  displayText: 'Social housing',
                  description: null,
                  exclusive: false,
                },
                {
                  id: 'HOMEOWNER',
                  displayText: 'Homeowner',
                  description: null,
                  exclusive: false,
                },
                {
                  id: 'NO_PERMANENT_OR_FIXED',
                  displayText: 'No permanent or fixed address',
                  description: null,
                  exclusive: false,
                },
                { id: 'NO_ANSWER', displayText: 'No answer provided', description: null, exclusive: false },
              ],
              validationType: 'MANDATORY',
            },
            answer: null,
            originalPageId: 'WHERE_DID_THEY_LIVE',
          },
        ],
      },
    },
  })

const nextPageWhereDoTheyLiveAfterChoosingRented = () =>
  stubFor({
    name: 'JohnSmith immediate needs report Where do they live next page after choosing Private Rented',
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/ACCOMMODATION/next-page?version=1&assessmentType=BCST2&currentPage=WHERE_DID_THEY_LIVE',
      method: 'POST',
      bodyPatterns: [
        {
          matchesJsonPath: {
            expression: '$.questionsAndAnswers[0].question',
            contains: 'WHERE_DID_THEY_LIVE',
          },
        },
        {
          matchesJsonPath: {
            expression: '$.questionsAndAnswers[0].answer.answer',
            contains: 'PRIVATE_RENTED_HOUSING',
          },
        },
      ],
    },
    response: {
      status: 200,
      headers: responseHeaders,
      jsonBody: {
        nextPageId: 'WHERE_DID_THEY_LIVE_ADDRESS',
      },
    },
  })

const addressPage = () =>
  stubFor({
    name: 'John Smith Address Page',
    request: {
      method: 'GET',
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/ACCOMMODATION/page/WHERE_DID_THEY_LIVE_ADDRESS?assessmentType=BCST2&version=1',
    },
    response: {
      status: 200,
      headers: responseHeaders,
      jsonBody: {
        id: 'WHERE_DID_THEY_LIVE_ADDRESS',
        questionsAndAnswers: [
          {
            answer: null,
            originalPageId: 'WHERE_DID_THEY_LIVE_ADDRESS',
            question: {
              '@class': 'ResettlementAssessmentResponseQuestion',
              id: 'WHERE_DID_THEY_LIVE_ADDRESS',
              options: null,
              subTitle: null,
              title: 'Enter the address',
              type: 'ADDRESS',
              validationType: 'MANDATORY',
            },
          },
        ],
        title: 'Where did the person in prison live before custody?',
      },
    },
  })

const nextPageAddress = () =>
  stubFor({
    name: 'JohnSmith immediate needs report next page after entering address',
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/ACCOMMODATION/next-page?version=1&assessmentType=BCST2&currentPage=WHERE_DID_THEY_LIVE_ADDRESS',
      method: 'POST',
      bodyPatterns: [
        {
          matchesJsonPath: {
            expression: '$.questionsAndAnswers[0].question',
            contains: 'WHERE_DID_THEY_LIVE_ADDRESS',
          },
        },
      ],
    },
    response: {
      status: 200,
      headers: responseHeaders,
      jsonBody: {
        nextPageId: 'HELP_TO_KEEP_HOME',
      },
    },
  })

const helpToKeepHomePage = () =>
  stubFor({
    name: 'John Smith Help To keep home Page',
    request: {
      method: 'GET',
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/ACCOMMODATION/page/HELP_TO_KEEP_HOME?assessmentType=BCST2&version=1',
    },
    response: {
      status: 200,
      headers: responseHeaders,
      jsonBody: {
        id: 'HELP_TO_KEEP_HOME',
        questionsAndAnswers: [
          {
            answer: null,
            originalPageId: 'HELP_TO_KEEP_HOME',
            question: {
              '@class': 'ResettlementAssessmentResponseQuestion',
              id: 'HELP_TO_KEEP_HOME',
              options: [
                {
                  description: null,
                  displayText: 'Yes',
                  exclusive: false,
                  id: 'YES',
                },
                {
                  description: null,
                  displayText: 'No',
                  exclusive: false,
                  id: 'NO',
                },
                {
                  description: null,
                  displayText: 'No answer provided',
                  exclusive: false,
                  id: 'NO_ANSWER',
                },
              ],
              subTitle: null,
              title: 'Does the person in prison or their family need help to keep their home while they are in prison?',
              type: 'RADIO',
              validationType: 'MANDATORY',
            },
          },
        ],
        title: null,
      },
    },
  })

const nextPageWhereDoTheyLiveAfterChoosingNone = () =>
  stubFor({
    name: 'JohnSmith immediate needs report Where do they live next page after choosing No permenant or fixed',
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/ACCOMMODATION/next-page?version=1&assessmentType=BCST2&currentPage=WHERE_DID_THEY_LIVE',
      method: 'POST',
      bodyPatterns: [
        {
          matchesJsonPath: {
            expression: '$.questionsAndAnswers[0].question',
            contains: 'WHERE_DID_THEY_LIVE',
          },
        },
        {
          matchesJsonPath: {
            expression: '$.questionsAndAnswers[0].answer.answer',
            contains: 'NO_PERMANENT_OR_FIXED',
          },
        },
      ],
    },
    response: {
      status: 200,
      headers: responseHeaders,
      jsonBody: {
        nextPageId: 'WHERE_WILL_THEY_LIVE_2',
      },
    },
  })

const whereWillTheyLive2Page = () =>
  stubFor({
    name: 'John Smith Where will they live 2 page',
    request: {
      method: 'GET',
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/ACCOMMODATION/page/WHERE_WILL_THEY_LIVE_2?assessmentType=BCST2&version=1',
    },
    response: {
      status: 200,
      headers: responseHeaders,
      jsonBody: {
        id: 'WHERE_WILL_THEY_LIVE_2',
        title: null,
        questionsAndAnswers: [
          {
            question: {
              '@class': 'ResettlementAssessmentResponseQuestion',
              id: 'WHERE_WILL_THEY_LIVE_2',
              title: 'Where will the person in prison live when they are released?',
              subTitle: null,
              type: 'RADIO',
              options: [
                {
                  id: 'MOVE_TO_NEW_ADDRESS',
                  displayText: 'Move to a new address',
                  description: null,
                  exclusive: false,
                },
                {
                  id: 'DOES_NOT_HAVE_ANYWHERE',
                  displayText: 'Does not have anywhere to live',
                  description: null,
                  exclusive: false,
                },
                { id: 'NO_ANSWER', displayText: 'No answer provided', description: null, exclusive: false },
              ],
              validationType: 'MANDATORY',
            },
            answer: null,
            originalPageId: 'WHERE_WILL_THEY_LIVE_2',
          },
        ],
      },
    },
  })

const nextPageWhereWillTheyLive = () =>
  stubFor({
    name: 'JohnSmith immediate needs report Where will they live next page',
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/ACCOMMODATION/next-page?version=1&assessmentType=BCST2&currentPage=WHERE_WILL_THEY_LIVE_2',
      method: 'POST',
      bodyPatterns: [
        {
          matchesJsonPath: {
            expression: '$.questionsAndAnswers[0].answer.answer',
            contains: 'DOES_NOT_HAVE_ANYWHERE',
          },
        },
      ],
    },
    response: {
      status: 200,
      headers: responseHeaders,
      jsonBody: {
        nextPageId: 'ASSESSMENT_SUMMARY',
      },
    },
  })

const submitAccommodationAssessmentEdit1 = () =>
  stubFor({
    name: 'JohnSmith immediate needs report Accommodation Assessment Submit',
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/ACCOMMODATION/complete?assessmentType=BCST2',
      method: 'POST',
      bodyPatterns: [
        {
          matchesJsonPath: {
            expression: '$.questionsAndAnswers[0].question',
            contains: 'WHERE_DID_THEY_LIVE',
          },
        },
        {
          matchesJsonPath: {
            expression: '$.questionsAndAnswers[0].answer.answer',
            contains: 'NO_PERMANENT_OR_FIXED',
          },
        },
        {
          matchesJsonPath: {
            expression: '$.questionsAndAnswers[1].question',
            contains: 'WHERE_WILL_THEY_LIVE_2',
          },
        },
        {
          matchesJsonPath: {
            expression: '$.questionsAndAnswers[1].answer.answer',
            contains: 'DOES_NOT_HAVE_ANYWHERE',
          },
        },
        {
          matchesJsonPath: {
            expression: '$.questionsAndAnswers[2].question',
            contains: 'SUPPORT_NEEDS',
          },
        },
        {
          matchesJsonPath: {
            expression: '$.questionsAndAnswers[2].answer.answer',
            contains: 'SUPPORT_REQUIRED',
          },
        },
        {
          matchesJsonPath: {
            expression: '$.questionsAndAnswers[3].question',
            contains: 'CASE_NOTE_SUMMARY',
          },
        },
        {
          matchesJsonPath: {
            expression: '$.questionsAndAnswers[3].answer.answer',
            contains: 'Needs somewhere to stay',
          },
        },
      ],
    },
    response: {
      status: 200,
      headers: submitHeaders,
    },
  })

const submitAccommodationAssessmentEdit2 = () =>
  stubFor({
    name: 'JohnSmith immediate needs report Accommodation Assessment Submit',
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/ACCOMMODATION/complete?assessmentType=BCST2',
      method: 'POST',
      bodyPatterns: [
        {
          matchesJsonPath: {
            expression: '$.questionsAndAnswers[0].question',
            contains: 'WHERE_DID_THEY_LIVE',
          },
        },
        {
          matchesJsonPath: {
            expression: '$.questionsAndAnswers[0].answer.answer',
            contains: 'NO_PERMANENT_OR_FIXED',
          },
        },
        {
          matchesJsonPath: {
            expression: '$.questionsAndAnswers[1].question',
            contains: 'WHERE_WILL_THEY_LIVE_2',
          },
        },
        {
          matchesJsonPath: {
            expression: '$.questionsAndAnswers[1].answer.answer',
            contains: 'DOES_NOT_HAVE_ANYWHERE',
          },
        },
        {
          matchesJsonPath: {
            expression: '$.questionsAndAnswers[2].question',
            contains: 'SUPPORT_NEEDS',
          },
        },
        {
          matchesJsonPath: {
            expression: '$.questionsAndAnswers[2].answer.answer',
            contains: 'SUPPORT_NOT_REQUIRED',
          },
        },
        {
          matchesJsonPath: {
            expression: '$.questionsAndAnswers[3].question',
            contains: 'CASE_NOTE_SUMMARY',
          },
        },
        {
          matchesJsonPath: {
            expression: '$.questionsAndAnswers[3].answer.answer',
            contains: 'No support required',
          },
        },
      ],
    },
    response: {
      status: 200,
      headers: submitHeaders,
    },
  })
const nextPageHelpToKeepHome = () =>
  stubFor({
    name: 'JohnSmith immediate needs report help to keep home next page',
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/ACCOMMODATION/next-page?version=1&assessmentType=BCST2&currentPage=HELP_TO_KEEP_HOME',
      method: 'POST',
      bodyPatterns: [
        {
          matchesJsonPath: {
            expression: '$.questionsAndAnswers[0].answer.answer',
            contains: 'NO',
          },
        },
      ],
    },
    response: {
      status: 200,
      headers: responseHeaders,
      jsonBody: {
        nextPageId: 'ASSESSMENT_SUMMARY',
      },
    },
  })

const nextPageStartAllQuestionTypes = () =>
  stubFor({
    name: 'JohnSmith immediate needs report Accommodation Assessment Next Page 1',
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/ACCOMMODATION/next-page?version=99&assessmentType=BCST2',
      method: 'POST',
      bodyPatterns: [
        {
          equalToJson: '{"questionsAndAnswers":[]}',
          ignoreArrayOrder: true,
          ignoreExtraElements: true,
        },
      ],
    },
    response: {
      status: 200,
      headers: responseHeaders,
      jsonBody: {
        nextPageId: 'SINGLE_QUESTION_ON_A_PAGE',
      },
    },
  })

const singleQuestionOnPage = () =>
  stubFor({
    name: 'Single question on a page, radio question',
    request: {
      method: 'GET',
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/ACCOMMODATION/next-page?version=99&assessmentType=BCST2&currentPage=SINGLE_QUESTION_ON_A_PAGE',
    },
    response: {
      status: 200,
      headers: responseHeaders,
      jsonBody: {
        id: 'SINGLE_QUESTION_ON_A_PAGE',
        title: null,
        questionsAndAnswers: [
          {
            question: {
              '@class': 'ResettlementAssessmentResponseQuestion',
              id: 'SINGLE_QUESTION_ON_A_PAGE',
              title: 'Single question on a page This is a radio Question?',
              subTitle: null,
              type: 'RADIO',
              options: [
                {
                  id: 'YES',
                  displayText: 'Yes',
                  description: null,
                  exclusive: false,
                },
                {
                  id: 'NO',
                  displayText: 'No',
                  description: null,
                  exclusive: false,
                },
                {
                  id: 'NO_ANSWER',
                  displayText: 'No answer provided',
                  description: null,
                  exclusive: false,
                },
              ],
              validationType: 'MANDATORY',
            },
            answer: null,
            originalPageId: 'SINGLE_QUESTION_ON_A_PAGE',
          },
        ],
      },
    },
  })
const multipleQuestionsOnPage = () =>
  stubFor({
    name: 'Multiple questions on a page, radio question',
    request: {
      method: 'GET',
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/ACCOMMODATION/next-page?version=99&assessmentType=BCST2&currentPage=MULTIPLE_QUESTIONS_ON_A_PAGE',
    },
    response: {
      status: 200,
      headers: responseHeaders,
      jsonBody: {
        id: 'MULTIPLE_QUESTIONS_ON_A_PAGE',
        title: null,
        questionsAndAnswers: [
          {
            question0: {
              '@class': 'ResettlementAssessmentResponseQuestion',
              id: 'MULTIPLE_QUESTIONS_ON_A_PAGE',
              title: 'Multiple questions on a page Radio question with regex validation?',
              subTitle: null,
              type: 'RADIO',
              options: [
                {
                  id: 'YES',
                  displayText: 'Yes',
                  description: null,
                  exclusive: false,
                },
                {
                  id: 'NO',
                  displayText: 'No',
                  description: null,
                  exclusive: false,
                },
                {
                  id: 'NO_ANSWER',
                  displayText: 'No answer provided',
                  description: null,
                  exclusive: false,
                },
              ],
              validationType: 'MANDATORY',
            },
            question1: {
              '@class': 'ResettlementAssessmentResponseQuestion',
              id: 'ADDRESS_QUESTION',
              options: null,
              subTitle: null,
              title: 'Address question: Enter the address',
              type: 'ADDRESS',
              validationType: 'MANDATORY',
            },
            question2: {
              '@class': 'ResettlementAssessmentResponseQuestion',
              id: 'NESTED_RADIO_QUESTION_TYPES',
              title: 'Nested Radio question types?',
              subTitle: null,
              type: 'RADIO',
              options: [
                {
                  id: 'YES',
                  displayText: 'Yes',
                  description: null,
                  exclusive: false,
                },
                {
                  id: 'NO',
                  displayText: 'No',
                  description: null,
                  exclusive: false,
                },
                {
                  id: 'NO_ANSWER',
                  displayText: 'No answer provided',
                  description: null,
                  exclusive: false,
                },
              ],
              validationType: 'MANDATORY',
            },
            question3: {
              '@class': 'ResettlementAssessmentResponseQuestion',
              id: 'LONG_TEXT_QUESTION',
              title: 'Long Text Question',
              subTitle: 'This will be displayed as a case note in both DPS and nDelius',
              type: 'LONG_TEXT',
            },
            question4: {
              '@class': 'ResettlementAssessmentResponseQuestion',
              id: 'CHECKBOX_QUESTIONS_WITH_EXCLUSIVE_OPTIONS',
              title: 'Checkbox question with exclusive options?',
              subTitle: 'Select all that apply',
              type: 'CHECKBOX',
              options: [
                {
                  id: 'ESA',
                  displayText: 'Employment and support allowance (ESA)',
                  description: null,
                  exclusive: false,
                },
                {
                  id: 'HOUSING_BENEFIT',
                  displayText: 'Housing benefit',
                  description: null,
                  exclusive: false,
                },
                {
                  id: 'UNIVERSAL_CREDIT_HOUSING_ELEMENT',
                  displayText: 'Universal credit housing element',
                  description: null,
                  exclusive: false,
                },
                {
                  id: 'UNIVERSAL_CREDIT',
                  displayText: 'Universal credit',
                  description: null,
                  exclusive: false,
                },
                {
                  id: 'PIP',
                  displayText: 'Personal independence payment (PIP)',
                  description: null,
                  exclusive: false,
                },
                {
                  id: 'STATE_PENSION',
                  displayText: 'State pension',
                  description: null,
                  exclusive: false,
                },
                {
                  id: 'NO_BENEFITS',
                  displayText: 'No benefits',
                  description: null,
                  exclusive: true,
                },
                {
                  id: 'NO_ANSWER',
                  displayText: 'No answer provided',
                  description: null,
                  exclusive: true,
                },
              ],
              validationType: 'MANDATORY',
            },

            answer: null,
            originalPageId: 'MULTIPLE_QUESTIONS_ON_A_PAGE',
          },
        ],
      },
    },
  })
const divergentFlowOptions = () =>
  stubFor({
    name: 'Divergent flow options',
    request: {
      method: 'GET',
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/ACCOMMODATION/next-page?version=99&assessmentType=BCST2&currentPage=DIVERGENT_FLOW_OPTIONS',
    },
    response: {
      status: 200,
      headers: responseHeaders,
      jsonBody: {
        id: 'DIVERGENT_FLOW_OPTIONS',
        title: null,
        questionsAndAnswers: [
          {
            question: {
              '@class': 'ResettlementAssessmentResponseQuestion',
              id: 'DIVERGENT_FLOW_OPTIONS',
              title: 'Divergent flow options yes for divergent flow?',
              subTitle: null,
              type: 'RADIO',
              options: [
                {
                  id: 'YES',
                  displayText: 'Yes',
                  description: null,
                  exclusive: false,
                },
                {
                  id: 'NO',
                  displayText: 'No',
                  description: null,
                  exclusive: false,
                },
                {
                  id: 'NO_ANSWER',
                  displayText: 'No answer provided',
                  description: null,
                  exclusive: false,
                },
              ],
              validationType: 'MANDATORY',
            },
            answer: null,
            originalPageId: 'DIVERGENT_FLOW_OPTIONS',
          },
        ],
      },
    },
  })
const divergentOptionYes = () =>
  stubFor({
    name: 'Divergent option Yes',
    request: {
      method: 'GET',
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/ACCOMMODATION/next-page?version=99&assessmentType=BCST2&currentPage=DIVERGENT_OPTION',
    },
    response: {
      status: 200,
      headers: responseHeaders,
      jsonBody: {
        id: 'DIVERGENT_OPTION',
        title: null,
        questionsAndAnswers: [
          {
            question: {
              '@class': 'ResettlementAssessmentResponseQuestion',
              id: 'DIVERGENT_OPTION',
              title: 'Divergent option route?',
              subTitle: null,
              type: 'CHECKBOX',
              options: [
                {
                  id: 'PHYSICAL_HEALTH',
                  displayText: 'Physical health',
                  description: null,
                  exclusive: false,
                },
                {
                  id: 'MENTAL_HEALTH',
                  displayText: 'Mental health',
                  description: null,
                  exclusive: false,
                },
                {
                  id: 'NO_ANSWER',
                  displayText: 'No answer provided',
                  description: null,
                  exclusive: true,
                },
              ],
              validationType: 'MANDATORY',
            },
            answer: null,
            originalPageId: 'DIVERGENT_OPTION',
          },
        ],
      },
    },
  })
const mandatoryAndOptionalQuestionsPage = () =>
  stubFor({
    name: 'Mandatory and optional questions',
    request: {
      method: 'GET',
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/ACCOMMODATION/next-page?version=99&assessmentType=BCST2&currentPage=MANDATORY_AND_OPTIONAL_QUESTIONS',
    },
    response: {
      status: 200,
      headers: responseHeaders,
      jsonBody: {
        id: 'MANDATORY_AND_OPTIONAL_QUESTIONS',
        title: null,
        questionsAndAnswers: [
          {
            question0: {
              '@class': 'ResettlementAssessmentResponseQuestion',
              id: 'MANDATORY_QUESTION',
              title: 'Mandatory question status',
              subTitle: 'Select one option',
              type: 'RADIO',
              options: [
                {
                  id: 'SUPPORT_REQUIRED',
                  displayText: 'Support required',
                  description: 'a need for support has been identified and is accepted',
                  exclusive: false,
                },
                {
                  id: 'SUPPORT_NOT_REQUIRED',
                  displayText: 'Support not required',
                  description: 'no need was identified',
                  exclusive: false,
                },
                {
                  id: 'SUPPORT_DECLINED',
                  displayText: 'Support declined',
                  description: 'a need has been identified but support is declined',
                  exclusive: false,
                },
              ],
              validationType: 'MANDATORY',
            },
            question1: {
              '@class': 'ResettlementAssessmentResponseQuestion',
              id: 'OPTIONAL_QUESTION',
              title: 'This is an optional question to enter address select move to new address',
              subTitle: null,
              type: 'RADIO',
              options: [
                {
                  id: 'RETURN_TO_PREVIOUS_ADDRESS',
                  displayText: 'Return to their previous address',
                  description: null,
                  exclusive: false,
                },
                {
                  id: 'MOVE_TO_NEW_ADDRESS',
                  displayText: 'Move to a new address',
                  description: null,
                  exclusive: false,
                },
                {
                  id: 'DOES_NOT_HAVE_ANYWHERE',
                  displayText: 'Does not have anywhere to live',
                  description: null,
                  exclusive: false,
                },
              ],
              validationType: 'MANDATORY',
            },
            answer: null,
            originalPageId: 'MANDATORY_AND_OPTIONAL_QUESTIONS',
          },
        ],
      },
    },
  })

export const johnSmithImmediateNeedsReportHealth = (): SuperAgentRequest[] => [
  stubJohnSmithPrisonerDetails(),
  initialTaskListAllCompleteButHealth(),
  nextPageStartHealth(),
  healthAssessment(),
  nextPageHealth(),
  meetHealthCareTeamPage(),
  nextPageHealthcareTeam(),
  supportRequirementsPage(),
  nextPageSupportRequirements(),
  assessmentSummaryPage('HEALTH', 'Health'),
  nextPageSummary('HEALTH'),
  checkAnswersPage('HEALTH'),
  submitAssessment(),
  completedTaskList(),
  submit(),
  getResettlementAssessmentVersion('HEALTH', 'BCST2'),
  validateAssessment('HEALTH', 'BCST2'),
]

export const johnSmithImmediateNeedsReportHealthWithFreeText = (): SuperAgentRequest[] => [
  stubJohnSmithPrisonerDetails(),
  initialTaskListAllCompleteButHealth(),
  nextPageStartHealth(),
  healthAssessment(),
  nextPageHealth(),
  meetHealthCareTeamPage(),
  nextPageHealthcareTeam(),
  supportRequirementsPageFreeText(),
  nextPageSupportRequirements(),
  assessmentSummaryPage('HEALTH', 'Health'),
  nextPageSummary('HEALTH'),
  checkAnswersPage('HEALTH'),
  completeAssessmentHealthFreeText(),
  completedTaskList(),
  submit(),
  getResettlementAssessmentVersion('HEALTH', 'BCST2'),
  validateAssessment('HEALTH', 'BCST2'),
]

export const johnSmithImmediateNeedsReportAccommodation = (): SuperAgentRequest[] => [
  stubJohnSmithPrisonerDetails(),
  initialTaskList(),
  nextPageStartAccommodation(),
  whereDoTheyLivePage(),
  nextPageWhereDoTheyLiveAfterChoosingRented(),
  addressPage(),
  nextPageAddress(),
  helpToKeepHomePage(),
  nextPageWhereDoTheyLiveAfterChoosingNone(),
  whereWillTheyLive2Page(),
  nextPageWhereWillTheyLive(),
  assessmentSummaryPage('ACCOMMODATION', 'Accommodation'),
  nextPageSummary('ACCOMMODATION'),
  checkAnswersPage('ACCOMMODATION'),
  submitAccommodationAssessmentEdit1(),
  submitAccommodationAssessmentEdit2(),
  nextPageHelpToKeepHome(),
  getResettlementAssessmentVersion('ACCOMMODATION', 'BCST2'),
  validateAssessment('ACCOMMODATION', 'BCST2'),
]
export const johnSmithImmediateNeedsReportAllQuestionTypes = (): SuperAgentRequest[] => [
  stubJohnSmithPrisonerDetails(),
  initialTaskList(),
  nextPageStartAllQuestionTypes(),
  singleQuestionOnPage(),
  multipleQuestionsOnPage(),
  divergentFlowOptions(),
  divergentOptionYes(),
  mandatoryAndOptionalQuestionsPage(),
  assessmentSummaryPage('ACCOMMODATION', 'Accommodation'),
  nextPageSummary('ACCOMMODATION'),
  checkAnswersPage('ACCOMMODATION'),
  submitAccommodationAssessmentEdit1(),
  submitAccommodationAssessmentEdit2(),
  nextPageHelpToKeepHome(),
  getResettlementAssessmentVersion('ACCOMMODATION', 'BCST2'),
  validateAssessment('ACCOMMODATION', 'BCST2'),
]

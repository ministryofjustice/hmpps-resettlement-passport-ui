import { SuperAgentRequest } from 'superagent'
import { stubFor } from '../../wiremock'
import { responseHeaders, submitHeaders } from '../../headers'

export const stubJohnSmithPrisonerDetails = () =>
  stubFor({
    name: 'JohnSmith BCST2 Details',
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
          releaseDate: '2024-06-17',
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
      },
    },
  })

const initialTaskList = () =>
  stubFor({
    name: 'JohnSmith BCST2 Initial task list',
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
    scenarioName: 'john-smith-bcst2',
    requiredScenarioState: 'Started',
  })

const initialTaskListAllCompleteButHealth = () =>
  stubFor({
    name: 'JohnSmith BCST2 Initial task list',
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
    scenarioName: 'john-smith-bcst2',
    requiredScenarioState: 'Started',
  })

const nextPageStartHealth = () =>
  stubFor({
    name: 'JohnSmith BCST2 Health Assessment Next Page 1',
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/HEALTH/next-page?assessmentType=BCST2',
      method: 'POST',
      bodyPatterns: [
        {
          equalToJson: '{"questionsAndAnswers":null}',
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
    name: 'John Smith BCST2 Health Assessment',
    request: {
      method: 'GET',
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/HEALTH/page/REGISTERED_WITH_GP?assessmentType=BCST2',
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
        ],
      },
    },
  })

const nextPageHealth = () =>
  stubFor({
    name: 'JohnSmith BCST2 Health Assessment Next Page Health',
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/HEALTH/next-page?assessmentType=BCST2&currentPage=REGISTERED_WITH_GP',
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
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/HEALTH/page/MEET_HEALTHCARE_TEAM?assessmentType=BCST2',
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
    name: 'JohnSmith BCST2 Health Assessment Next Page Healthcare Team Meeting',
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/HEALTH/next-page?assessmentType=BCST2&currentPage=MEET_HEALTHCARE_TEAM',
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
        nextPageId: 'ASSESSMENT_SUMMARY',
      },
    },
  })

const assessmentSummaryPage = (pathway: string) =>
  stubFor({
    name: 'John Smith BCST2 Assessment Summary Page',
    request: {
      method: 'GET',
      url: `/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/${pathway}/page/ASSESSMENT_SUMMARY?assessmentType=BCST2`,
    },
    response: {
      status: 200,
      headers: responseHeaders,
      jsonBody: {
        id: 'ASSESSMENT_SUMMARY',
        title: null,
        questionsAndAnswers: [
          {
            question: {
              '@class': 'ResettlementAssessmentResponseQuestion',
              id: 'SUPPORT_NEEDS',
              title: '',
              subTitle: null,
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
    name: 'JohnSmith BCST2 Next Page Summary',
    request: {
      url: `/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/${pathway}/next-page?assessmentType=BCST2&currentPage=ASSESSMENT_SUMMARY`,
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
    name: 'John Smith BCST2 Check Answers Page',
    request: {
      method: 'GET',
      url: `/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/${pathway}/page/CHECK_ANSWERS?assessmentType=BCST2`,
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
    name: 'JohnSmith BCST2 Health Assessment Submit',
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
                  '@class': 'StringAnswer',
                  answer: 'SUPPORT_NOT_REQUIRED',
                  displayText: 'Support not required',
                },
                pageId: 'ASSESSMENT_SUMMARY',
                question: 'SUPPORT_NEEDS',
                questionTitle: '',
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
          }),
          ignoreArrayOrder: true,
        },
      ],
    },
    response: {
      status: 200,
      headers: submitHeaders,
    },
    scenarioName: 'john-smith-bcst2',
    requiredScenarioState: 'Started',
    newScenarioState: 'After-Complete',
  })
}

const completedTaskList = () =>
  stubFor({
    name: 'JohnSmith BCST2 Completed task list',
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
    scenarioName: 'john-smith-bcst2',
    requiredScenarioState: 'After-Complete',
  })

const submit = () =>
  stubFor({
    name: 'John Smith BCST2 Submit',
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/submit?assessmentType=BCST2',
      method: 'POST',
    },
    response: {
      status: 200,
      headers: submitHeaders,
    },
  })

const nextPageStartAccommodation = () =>
  stubFor({
    name: 'JohnSmith BCST2 Accommodation Assessment Next Page 1',
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/ACCOMMODATION/next-page?assessmentType=BCST2',
      method: 'POST',
      bodyPatterns: [
        {
          equalToJson: '{"questionsAndAnswers":null}',
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
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/ACCOMMODATION/page/WHERE_DID_THEY_LIVE?assessmentType=BCST2',
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
    name: 'JohnSmith BCST2 Where do they live next page after choosing Private Rented',
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/ACCOMMODATION/next-page?assessmentType=BCST2&currentPage=WHERE_DID_THEY_LIVE',
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
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/ACCOMMODATION/page/WHERE_DID_THEY_LIVE_ADDRESS?assessmentType=BCST2',
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
    name: 'JohnSmith BCST2 next page after entering address',
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/ACCOMMODATION/next-page?assessmentType=BCST2&currentPage=WHERE_DID_THEY_LIVE_ADDRESS',
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
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/ACCOMMODATION/page/HELP_TO_KEEP_HOME?assessmentType=BCST2',
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
    name: 'JohnSmith BCST2 Where do they live next page after choosing No permenant or fixed',
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/ACCOMMODATION/next-page?assessmentType=BCST2&currentPage=WHERE_DID_THEY_LIVE',
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
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/ACCOMMODATION/page/WHERE_WILL_THEY_LIVE_2?assessmentType=BCST2',
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
    name: 'JohnSmith BCST2 Where will they live next page',
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/ACCOMMODATION/next-page?assessmentType=BCST2&currentPage=WHERE_WILL_THEY_LIVE_2',
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

const submitAccommodationAssessment = () =>
  stubFor({
    name: 'JohnSmith BCST2 Accommodation Assessment Submit',
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/ACCOMMODATION/complete?assessmentType=BCST2',
      method: 'POST',
      bodyPatterns: [
        {
          equalToJson: JSON.stringify({
            questionsAndAnswers: [
              {
                question: 'WHERE_DID_THEY_LIVE',
                questionTitle: 'Where did the person in prison live before custody?',
                questionType: 'RADIO',
                pageId: 'WHERE_DID_THEY_LIVE',
                answer: {
                  answer: 'NO_PERMANENT_OR_FIXED',
                  displayText: 'No permanent or fixed address',
                  '@class': 'StringAnswer',
                },
              },
              {
                question: 'WHERE_WILL_THEY_LIVE_2',
                questionTitle: 'Where will the person in prison live when they are released?',
                questionType: 'RADIO',
                pageId: 'WHERE_WILL_THEY_LIVE_2',
                answer: {
                  answer: 'DOES_NOT_HAVE_ANYWHERE',
                  displayText: 'Does not have anywhere to live',
                  '@class': 'StringAnswer',
                },
              },
              {
                question: 'SUPPORT_NEEDS',
                questionTitle: '',
                questionType: 'RADIO',
                pageId: 'ASSESSMENT_SUMMARY',
                answer: { answer: 'SUPPORT_REQUIRED', displayText: 'Support required', '@class': 'StringAnswer' },
              },
              {
                question: 'CASE_NOTE_SUMMARY',
                questionTitle: 'Add a case note summary',
                questionType: 'LONG_TEXT',
                pageId: 'ASSESSMENT_SUMMARY',
                answer: {
                  answer: 'Needs somewhere to stay',
                  displayText: 'Needs somewhere to stay',
                  '@class': 'StringAnswer',
                },
              },
            ],
          }),
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
    name: 'JohnSmith BCST2 help to keep home next page',
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/ACCOMMODATION/next-page?assessmentType=BCST2&currentPage=HELP_TO_KEEP_HOME',
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

export const johnSmithBCST2Health = (): SuperAgentRequest[] => [
  stubJohnSmithPrisonerDetails(),
  initialTaskListAllCompleteButHealth(),
  nextPageStartHealth(),
  healthAssessment(),
  nextPageHealth(),
  meetHealthCareTeamPage(),
  nextPageHealthcareTeam(),
  assessmentSummaryPage('HEALTH'),
  nextPageSummary('HEALTH'),
  checkAnswersPage('HEALTH'),
  submitAssessment(),
  completedTaskList(),
  submit(),
]

export const johnSmithBCSTAccommodation = (): SuperAgentRequest[] => [
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
  assessmentSummaryPage('ACCOMMODATION'),
  nextPageSummary('ACCOMMODATION'),
  checkAnswersPage('ACCOMMODATION'),
  submitAccommodationAssessment(),

  nextPageHelpToKeepHome(),
]

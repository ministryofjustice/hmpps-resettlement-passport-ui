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

const nextPageStart = () =>
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

const assessmentSummaryPage = () =>
  stubFor({
    name: 'John Smith BCST2 Assessment Summary Page',
    request: {
      method: 'GET',
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/HEALTH/page/ASSESSMENT_SUMMARY?assessmentType=BCST2',
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

const nextPageSummary = () =>
  stubFor({
    name: 'JohnSmith BCST2 Health Assessment Next Page Summary',
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/HEALTH/next-page?assessmentType=BCST2&currentPage=ASSESSMENT_SUMMARY',
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

const checkAnswersPage = () =>
  stubFor({
    name: 'John Smith BCST2 Check Answers Page',
    request: {
      method: 'GET',
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/HEALTH/page/CHECK_ANSWERS?assessmentType=BCST2',
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

export const johnSmithBCST2 = () => [
  stubJohnSmithPrisonerDetails(),
  initialTaskList(),
  nextPageStart(),
  healthAssessment(),
  nextPageHealth(),
  meetHealthCareTeamPage(),
  nextPageHealthcareTeam(),
  assessmentSummaryPage(),
  nextPageSummary(),
  checkAnswersPage(),
  submitAssessment(),
  completedTaskList(),
  submit(),
]

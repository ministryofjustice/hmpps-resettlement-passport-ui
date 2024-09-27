import { stubFor } from '../../wiremock'
import { responseHeaders } from '../../headers'

export const stubJohnSmithPrisonerDetailsPreRelease = () =>
  stubFor({
    name: 'resettlement-passport_prisoner_a8731dy',
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY',
      method: 'GET',
    },
    response: {
      status: 200,
      headers: responseHeaders,
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
          { pathway: 'ACCOMMODATION', status: 'DONE', lastDateChange: '2024-04-02' },
          { pathway: 'ATTITUDES_THINKING_AND_BEHAVIOUR', status: 'SUPPORT_NOT_REQUIRED', lastDateChange: '2024-04-02' },
          { pathway: 'CHILDREN_FAMILIES_AND_COMMUNITY', status: 'SUPPORT_NOT_REQUIRED', lastDateChange: '2024-04-02' },
          { pathway: 'DRUGS_AND_ALCOHOL', status: 'SUPPORT_NOT_REQUIRED', lastDateChange: '2024-04-02' },
          { pathway: 'EDUCATION_SKILLS_AND_WORK', status: 'SUPPORT_NOT_REQUIRED', lastDateChange: '2024-04-02' },
          { pathway: 'FINANCE_AND_ID', status: 'SUPPORT_NOT_REQUIRED', lastDateChange: '2024-04-02' },
          { pathway: 'HEALTH', status: 'SUPPORT_NOT_REQUIRED', lastDateChange: '2024-04-02' },
        ],
        assessmentRequired: false,
        resettlementReviewAvailable: true,
        immediateNeedsSubmitted: true,
        preReleaseSubmitted: false,
      },
    },
  })

export const johnSmithTaskList = () =>
  stubFor({
    name: 'resettlement-passport_prisoner_a8731dy_resettlement-assessment_summary',
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/summary?assessmentType=RESETTLEMENT_PLAN',
      method: 'GET',
    },
    response: {
      status: 200,
      jsonBody: [
        { pathway: 'ACCOMMODATION', assessmentStatus: 'NOT_STARTED' },
        { pathway: 'ATTITUDES_THINKING_AND_BEHAVIOUR', assessmentStatus: 'NOT_STARTED' },
        { pathway: 'CHILDREN_FAMILIES_AND_COMMUNITY', assessmentStatus: 'NOT_STARTED' },
        { pathway: 'DRUGS_AND_ALCOHOL', assessmentStatus: 'NOT_STARTED' },
        { pathway: 'EDUCATION_SKILLS_AND_WORK', assessmentStatus: 'NOT_STARTED' },
        { pathway: 'FINANCE_AND_ID', assessmentStatus: 'NOT_STARTED' },
        { pathway: 'HEALTH', assessmentStatus: 'NOT_STARTED' },
      ],
      headers: responseHeaders,
    },
    scenarioName: 'john-smith-pre-release',
    requiredScenarioState: 'Started',
  })

export const johnSmithTaskListAfterComplete = () =>
  stubFor({
    name: 'resettlement-passport_prisoner_a8731dy_resettlement-assessment_summary',
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/summary?assessmentType=RESETTLEMENT_PLAN',
      method: 'GET',
    },
    response: {
      status: 200,
      jsonBody: [
        { pathway: 'ACCOMMODATION', assessmentStatus: 'COMPLETE' },
        { pathway: 'ATTITUDES_THINKING_AND_BEHAVIOUR', assessmentStatus: 'NOT_STARTED' },
        { pathway: 'CHILDREN_FAMILIES_AND_COMMUNITY', assessmentStatus: 'NOT_STARTED' },
        { pathway: 'DRUGS_AND_ALCOHOL', assessmentStatus: 'NOT_STARTED' },
        { pathway: 'EDUCATION_SKILLS_AND_WORK', assessmentStatus: 'NOT_STARTED' },
        { pathway: 'FINANCE_AND_ID', assessmentStatus: 'NOT_STARTED' },
        { pathway: 'HEALTH', assessmentStatus: 'NOT_STARTED' },
      ],
      headers: responseHeaders,
    },
    scenarioName: 'john-smith-pre-release',
    requiredScenarioState: 'After-Complete',
  })

export const johnSmithAccommodationNextPage1 = () =>
  stubFor({
    name: 'resettlement-passport_prisoner_a8731dy_resettlement-assessment_accommodation_next-page',
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/ACCOMMODATION/next-page?version=1&assessmentType=RESETTLEMENT_PLAN',
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
      jsonBody: { nextPageId: 'WHERE_DID_THEY_LIVE' },
      headers: responseHeaders,
    },
  })

export const johnSmithWhereDidTheyLive = () =>
  stubFor({
    name: 'resettlement-passport_prisoner_a8731dy_resettlement-assessment_accommodation_page_where_did_they_live',
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/ACCOMMODATION/page/WHERE_DID_THEY_LIVE?assessmentType=RESETTLEMENT_PLAN&version=1',
      method: 'GET',
    },
    response: {
      status: 200,
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
                { id: 'SOCIAL_HOUSING', displayText: 'Social housing', description: null, exclusive: false },
                { id: 'HOMEOWNER', displayText: 'Homeowner', description: null, exclusive: false },
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
            answer: { '@class': 'StringAnswer', answer: 'NO_PERMANENT_OR_FIXED' },
            originalPageId: 'WHERE_DID_THEY_LIVE',
          },
        ],
      },
      headers: responseHeaders,
    },
  })

export const johnSmithNextPage2 = () =>
  stubFor({
    name: 'resettlement-passport_prisoner_a8731dy_resettlement-assessment_accommodation_next-page',
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/ACCOMMODATION/next-page?version=1&assessmentType=RESETTLEMENT_PLAN&currentPage=WHERE_DID_THEY_LIVE',
      method: 'POST',
      bodyPatterns: [
        {
          equalToJson:
            '{"questionsAndAnswers":[{"question":"WHERE_DID_THEY_LIVE","questionTitle":"Where did the person in prison live before custody?","questionType":"RADIO","pageId":"WHERE_DID_THEY_LIVE","answer":{"answer":"NO_PERMANENT_OR_FIXED","displayText":"No permanent or fixed address","@class":"StringAnswer"}}]}',
          ignoreArrayOrder: true,
          ignoreExtraElements: true,
        },
      ],
    },
    response: {
      status: 200,
      jsonBody: { nextPageId: 'WHERE_WILL_THEY_LIVE_2' },
      headers: responseHeaders,
    },
  })

export const johnSmithWhereWillTheyLive2 = () =>
  stubFor({
    name: 'resettlement-passport_prisoner_a8731dy_resettlement-assessment_accommodation_page_where_will_they_live_2',
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/ACCOMMODATION/page/WHERE_WILL_THEY_LIVE_2?assessmentType=RESETTLEMENT_PLAN&version=1',
      method: 'GET',
    },
    response: {
      status: 200,
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
            answer: { '@class': 'StringAnswer', answer: 'NO_ANSWER' },
            originalPageId: 'WHERE_WILL_THEY_LIVE_2',
          },
        ],
      },
      headers: responseHeaders,
    },
  })

export const johnSmithNextPage3 = () =>
  stubFor({
    name: 'resettlement-passport_prisoner_a8731dy_resettlement-assessment_accommodation_next-page',
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/ACCOMMODATION/next-page?version=1&assessmentType=RESETTLEMENT_PLAN&currentPage=WHERE_WILL_THEY_LIVE_2',
      method: 'POST',
      bodyPatterns: [
        {
          equalToJson:
            '{"questionsAndAnswers":[{"question":"WHERE_WILL_THEY_LIVE_2","questionTitle":"Where will the person in prison live when they are released?","questionType":"RADIO","pageId":"WHERE_WILL_THEY_LIVE_2","answer":{"answer":"NO_ANSWER","displayText":"No answer provided","@class":"StringAnswer"}}]}',
          ignoreArrayOrder: true,
          ignoreExtraElements: true,
        },
      ],
    },
    response: {
      status: 200,
      jsonBody: { nextPageId: 'PRERELEASE_ASSESSMENT_SUMMARY' },
      headers: responseHeaders,
    },
  })

export const johnSmithAssessmentSummary = () =>
  stubFor({
    name: 'resettlement-passport_prisoner_a8731dy_resettlement-assessment_accommodation_page_prerelease_assessment_summary',
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/ACCOMMODATION/page/PRERELEASE_ASSESSMENT_SUMMARY?assessmentType=RESETTLEMENT_PLAN&version=1',
      method: 'GET',
    },
    response: {
      status: 200,
      jsonBody: {
        id: 'PRERELEASE_ASSESSMENT_SUMMARY',
        title: 'Accommodation report summary',
        questionsAndAnswers: [
          {
            question: {
              '@class': 'ResettlementAssessmentResponseQuestion',
              id: 'SUPPORT_NEEDS_PRERELEASE',
              title: 'Accommodation support needs',
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
                { id: 'IN_PROGRESS', displayText: 'In progress', description: 'work is ongoing', exclusive: false },
                {
                  id: 'DONE',
                  displayText: 'Done',
                  description: 'all required work has been completed successfully',
                  exclusive: false,
                },
              ],
              validationType: 'MANDATORY',
            },
            answer: { '@class': 'StringAnswer', answer: 'DONE' },
            originalPageId: 'PRERELEASE_ASSESSMENT_SUMMARY',
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
              detailsTitle: 'Help with special category data',
              detailsContent:
                "Special category data includes any personal data concerning someone's health, sex life or sexual orientation. Or any personal data revealing someone's racial or ethnic origin, religious or philosophical beliefs or trade union membership.",
            },
            answer: null,
            originalPageId: 'PRERELEASE_ASSESSMENT_SUMMARY',
          },
        ],
      },
      headers: responseHeaders,
    },
  })

export const johnSmithNextPage4 = () =>
  stubFor({
    name: 'resettlement-passport_prisoner_a8731dy_resettlement-assessment_accommodation_next-page',
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/ACCOMMODATION/next-page?version=1&assessmentType=RESETTLEMENT_PLAN&currentPage=PRERELEASE_ASSESSMENT_SUMMARY',
      method: 'POST',
      bodyPatterns: [
        {
          equalToJson:
            '{"questionsAndAnswers":[{"question":"SUPPORT_NEEDS_PRERELEASE","questionTitle":"Accommodation support needs","questionType":"RADIO","pageId":"PRERELEASE_ASSESSMENT_SUMMARY","answer":{"answer":"DONE","displayText":"Done","@class":"StringAnswer"}},{"question":"CASE_NOTE_SUMMARY","questionTitle":"Add a case note summary","questionType":"LONG_TEXT","pageId":"PRERELEASE_ASSESSMENT_SUMMARY","answer":{"answer":"Note","displayText":"Note","@class":"StringAnswer"}}]}',
          ignoreArrayOrder: true,
          ignoreExtraElements: true,
        },
      ],
    },
    response: {
      status: 200,
      jsonBody: { nextPageId: 'CHECK_ANSWERS' },
      headers: responseHeaders,
    },
  })

export const johnSmithCheckAnswers = () =>
  stubFor({
    name: 'resettlement-passport_prisoner_a8731dy_resettlement-assessment_accommodation_page_check_answers',
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/ACCOMMODATION/page/CHECK_ANSWERS?assessmentType=RESETTLEMENT_PLAN&version=1',
      method: 'GET',
    },
    response: {
      status: 200,
      jsonBody: {
        id: 'CHECK_ANSWERS',
        title: null,
        questionsAndAnswers: [],
      },
      headers: responseHeaders,
    },
  })

export const johnSmithConfirm = () =>
  stubFor({
    name: 'resettlement-passport_prisoner_a8731dy_resettlement-assessment_accommodation_complete',
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/ACCOMMODATION/complete?assessmentType=RESETTLEMENT_PLAN',
      method: 'POST',
      bodyPatterns: [
        {
          equalToJson:
            '{"questionsAndAnswers":[{"question":"WHERE_DID_THEY_LIVE","questionTitle":"Where did the person in prison live before custody?","questionType":"RADIO","pageId":"WHERE_DID_THEY_LIVE","answer":{"answer":"NO_PERMANENT_OR_FIXED","displayText":"No permanent or fixed address","@class":"StringAnswer"}},{"question":"WHERE_WILL_THEY_LIVE_2","questionTitle":"Where will the person in prison live when they are released?","questionType":"RADIO","pageId":"WHERE_WILL_THEY_LIVE_2","answer":{"answer":"NO_ANSWER","displayText":"No answer provided","@class":"StringAnswer"}},{"question":"SUPPORT_NEEDS_PRERELEASE","questionTitle":"Accommodation support needs","questionType":"RADIO","pageId":"PRERELEASE_ASSESSMENT_SUMMARY","answer":{"answer":"DONE","displayText":"Done","@class":"StringAnswer"}},{"question":"CASE_NOTE_SUMMARY","questionTitle":"Add a case note summary","questionType":"LONG_TEXT","pageId":"PRERELEASE_ASSESSMENT_SUMMARY","answer":{"answer":"Note","displayText":"Note","@class":"StringAnswer"}}]}',
          ignoreArrayOrder: true,
          ignoreExtraElements: true,
        },
      ],
    },
    response: {
      status: 200,
      headers: responseHeaders,
    },
    scenarioName: 'john-smith-pre-release',
    requiredScenarioState: 'Started',
    newScenarioState: 'After-Complete',
  })

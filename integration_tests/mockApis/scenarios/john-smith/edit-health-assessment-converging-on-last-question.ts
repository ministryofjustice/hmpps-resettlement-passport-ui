import { stubFor } from '../../wiremock'
import { responseHeaders, submitHeaders } from '../../headers'
import { getResettlementAssessmentVersion } from './john-smith'

const profile = () =>
  stubFor({
    name: 'john smith immediate-needs-report-edit status',
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
          { pathway: 'ACCOMMODATION', status: 'SUPPORT_NOT_REQUIRED', lastDateChange: '2024-04-08' },
          { pathway: 'ATTITUDES_THINKING_AND_BEHAVIOUR', status: 'SUPPORT_NOT_REQUIRED', lastDateChange: '2024-04-08' },
          { pathway: 'CHILDREN_FAMILIES_AND_COMMUNITY', status: 'SUPPORT_NOT_REQUIRED', lastDateChange: '2024-04-08' },
          { pathway: 'DRUGS_AND_ALCOHOL', status: 'SUPPORT_DECLINED', lastDateChange: '2024-04-08' },
          { pathway: 'EDUCATION_SKILLS_AND_WORK', status: 'SUPPORT_REQUIRED', lastDateChange: '2024-04-08' },
          { pathway: 'FINANCE_AND_ID', status: 'SUPPORT_REQUIRED', lastDateChange: '2024-04-08' },
          { pathway: 'HEALTH', status: 'SUPPORT_NOT_REQUIRED', lastDateChange: '2024-04-08' },
        ],
        assessmentRequired: false,
        resettlementReviewAvailable: true,
        immediateNeedsSubmitted: true,
        preReleaseSubmitted: false,
      },
    },
  })

const getHealthAssessment = () =>
  stubFor({
    name: 'John Smith immediate needs report Edit get health',
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/HEALTH/latest',
      method: 'GET',
    },
    response: {
      status: 200,
      headers: responseHeaders,
      jsonBody: {
        originalAssessment: {
          assessmentType: 'BCST2',
          lastUpdated: '2024-09-12T08:22:09.486198',
          updatedBy: 'James Boobier',
          questionsAndAnswers: [
            {
              questionTitle: 'Is the person in prison registered with a GP surgery outside of prison?',
              answer: 'No',
              originalPageId: 'REGISTERED_WITH_GP',
            },
            {
              questionTitle: 'Does the person in prison want help registering with a GP surgery?',
              answer: 'No',
              originalPageId: 'HELP_REGISTERING_GP',
            },
            {
              questionTitle: 'Does the person in prison want to meet with a prison healthcare team?',
              answer: 'Yes',
              originalPageId: 'MEET_HEALTHCARE_TEAM',
            },
            {
              questionTitle: 'What health need is this related to?',
              answer: 'Physical health\nMental health',
              originalPageId: 'WHAT_HEALTH_NEED',
            },
          ],
        },
        latestAssessment: {
          assessmentType: 'BCST2',
          lastUpdated: '2024-09-12T09:40:49.672031',
          updatedBy: 'James Boobier',
          questionsAndAnswers: [
            {
              questionTitle: 'Is the person in prison registered with a GP surgery outside of prison?',
              answer: 'Yes',
              originalPageId: 'REGISTERED_WITH_GP',
            },
            {
              questionTitle: 'Does the person in prison want to meet with a prison healthcare team?',
              answer: 'Yes',
              originalPageId: 'MEET_HEALTHCARE_TEAM',
            },
            {
              questionTitle: 'What health need is this related to?',
              answer: 'Physical health\nMental health',
              originalPageId: 'WHAT_HEALTH_NEED',
            },
          ],
        },
      },
    },
  })

const getCheckAnswers = () =>
  stubFor({
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/HEALTH/page/CHECK_ANSWERS?assessmentType=BCST2&version=1',
      method: 'GET',
    },
    response: {
      status: 200,
      headers: responseHeaders,
      jsonBody: {
        id: 'CHECK_ANSWERS',
        title: null,
        questionsAndAnswers: [
          {
            question: {
              id: 'REGISTERED_WITH_GP',
              title: 'Is the person in prison registered with a GP surgery outside of prison?',
              subTitle: null,
              type: 'RADIO',
              options: [
                { id: 'YES', displayText: 'Yes', description: null, exclusive: false, nestedQuestions: null },
                { id: 'NO', displayText: 'No', description: null, exclusive: false, nestedQuestions: null },
                {
                  id: 'NO_ANSWER',
                  displayText: 'No answer provided',
                  description: null,
                  exclusive: false,
                  nestedQuestions: null,
                },
              ],
              validationType: 'MANDATORY',
              customValidation: null,
              detailsTitle: null,
              detailsContent: null,
            },
            answer: { '@class': 'StringAnswer', answer: 'YES' },
            originalPageId: 'REGISTERED_WITH_GP',
          },
          {
            question: {
              id: 'MEET_HEALTHCARE_TEAM',
              title: 'Does the person in prison want to meet with a prison healthcare team?',
              subTitle: null,
              type: 'RADIO',
              options: [
                { id: 'YES', displayText: 'Yes', description: null, exclusive: false, nestedQuestions: null },
                { id: 'NO', displayText: 'No', description: null, exclusive: false, nestedQuestions: null },
                {
                  id: 'NO_ANSWER',
                  displayText: 'No answer provided',
                  description: null,
                  exclusive: false,
                  nestedQuestions: null,
                },
              ],
              validationType: 'MANDATORY',
              customValidation: null,
              detailsTitle: null,
              detailsContent: null,
            },
            answer: { '@class': 'StringAnswer', answer: 'YES' },
            originalPageId: 'MEET_HEALTHCARE_TEAM',
          },
          {
            question: {
              id: 'WHAT_HEALTH_NEED',
              title: 'What health need is this related to?',
              subTitle: null,
              type: 'CHECKBOX',
              options: [
                {
                  id: 'PHYSICAL_HEALTH',
                  displayText: 'Physical health',
                  description: null,
                  exclusive: false,
                  nestedQuestions: null,
                },
                {
                  id: 'MENTAL_HEALTH',
                  displayText: 'Mental health',
                  description: null,
                  exclusive: false,
                  nestedQuestions: null,
                },
                {
                  id: 'NO_ANSWER',
                  displayText: 'No answer provided',
                  description: null,
                  exclusive: true,
                  nestedQuestions: null,
                },
              ],
              validationType: 'MANDATORY',
              customValidation: null,
              detailsTitle: null,
              detailsContent: null,
            },
            answer: { '@class': 'ListAnswer', answer: ['PHYSICAL_HEALTH', 'MENTAL_HEALTH'] },
            originalPageId: 'WHAT_HEALTH_NEED',
          },
        ],
      },
    },
  })

const getMeetHealthcareTeamPage = () =>
  stubFor({
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/HEALTH/page/MEET_HEALTHCARE_TEAM?assessmentType=BCST2&version=1',
      method: 'GET',
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
              id: 'MEET_HEALTHCARE_TEAM',
              title: 'Does the person in prison want to meet with a prison healthcare team?',
              subTitle: null,
              type: 'RADIO',
              options: [
                { id: 'YES', displayText: 'Yes', description: null, exclusive: false, nestedQuestions: null },
                { id: 'NO', displayText: 'No', description: null, exclusive: false, nestedQuestions: null },
                {
                  id: 'NO_ANSWER',
                  displayText: 'No answer provided',
                  description: null,
                  exclusive: false,
                  nestedQuestions: null,
                },
              ],
              validationType: 'MANDATORY',
              customValidation: null,
              detailsTitle: null,
              detailsContent: null,
            },
            answer: { '@class': 'StringAnswer', answer: 'YES' },
            originalPageId: 'MEET_HEALTHCARE_TEAM',
          },
        ],
      },
    },
  })

const nextPageMeetHealthcareTeam = () =>
  stubFor({
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/HEALTH/next-page?version=1&assessmentType=BCST2&currentPage=MEET_HEALTHCARE_TEAM',
      method: 'POST',
      bodyPatterns: [
        {
          equalToJson: {
            questionsAndAnswers: [
              {
                question: 'MEET_HEALTHCARE_TEAM',
                questionTitle: 'Does the person in prison want to meet with a prison healthcare team?',
                questionType: 'RADIO',
                pageId: 'MEET_HEALTHCARE_TEAM',
                answer: { answer: 'NO', displayText: 'No', '@class': 'StringAnswer' },
              },
            ],
            version: null,
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

const submitEdit = () => {
  return stubFor({
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/HEALTH/complete?assessmentType=BCST2&declaration=false',
      method: 'POST',
      bodyPatterns: [
        {
          equalToJson: JSON.stringify(healthCompleteValidateBody),
        },
      ],
    },
    response: {
      status: 200,
      headers: submitHeaders,
    },
  })
}

const validateAssessment = () => {
  return stubFor({
    request: {
      url: `/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/HEALTH/validate?assessmentType=BCST2`,
      method: 'POST',
      bodyPatterns: [
        {
          equalToJson: JSON.stringify(healthCompleteValidateBody),
          ignoreArrayOrder: true,
        },
      ],
    },
    response: {
      status: 200,
      headers: submitHeaders,
    },
  })
}

const healthCompleteValidateBody = {
  questionsAndAnswers: [
    {
      question: 'REGISTERED_WITH_GP',
      questionTitle: 'Is the person in prison registered with a GP surgery outside of prison?',
      pageId: 'REGISTERED_WITH_GP',
      questionType: 'RADIO',
      answer: { answer: 'YES', displayText: 'Yes', '@class': 'StringAnswer' },
    },
    {
      question: 'MEET_HEALTHCARE_TEAM',
      questionTitle: 'Does the person in prison want to meet with a prison healthcare team?',
      questionType: 'RADIO',
      pageId: 'MEET_HEALTHCARE_TEAM',
      answer: { answer: 'NO', displayText: 'No', '@class': 'StringAnswer' },
    },
  ],
  version: 1,
}

const editHealthAssessmentConvergingOnLastQuestion = () => [
  profile(),
  getHealthAssessment(),
  getCheckAnswers(),
  getMeetHealthcareTeamPage(),
  nextPageMeetHealthcareTeam(),
  submitEdit(),
  getResettlementAssessmentVersion('HEALTH', 'BCST2'),
  validateAssessment(),
]
export default editHealthAssessmentConvergingOnLastQuestion

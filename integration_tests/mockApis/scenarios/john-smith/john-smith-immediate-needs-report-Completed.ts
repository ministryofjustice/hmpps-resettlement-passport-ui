import { SuperAgentRequest } from 'superagent'
import { addMonths, format } from 'date-fns'
import { stubFor } from '../../wiremock'
import { responseHeaders, submitHeaders } from '../../headers'
import { getResettlementAssessmentVersion } from './john-smith'
import { validateAssessment } from '../../common'
import {
  nextPageStartAllQuestionTypes,
  postDivergentAnswerYes,
  postDivergentFlowOptionYes,
  postMandatoryAndOptionalQuestionsPage,
  postMultipleQuestionsOnAPage,
  postSingleQuestionOnAPage,
} from './john-smith-immediate-needs-report'

const stubJohnSmithPrisonerDetailsComplete = () =>
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

const getAccommodation = () =>
  stubFor({
    name: 'John Smith immediate needs report Edit get accommodation',
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
              validation: { type: 'MANDATORY' },
            },
            answer: { '@class': 'StringAnswer', answer: 'SUPPORT_NOT_REQUIRED' },
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
              validation: { type: 'MANDATORY' },
            },
            answer: { '@class': 'StringAnswer', answer: 'Case note summary text typed in here' },
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

const submitAllQuestionTypesAssessment = () =>
  stubFor({
    name: 'JohnSmith immediate needs report All Question types Assessment Submit',
    request: {
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/ACCOMMODATION/complete?assessmentType=BCST2',
      method: 'POST',
      bodyPatterns: [
        {
          matchesJsonPath: {
            expression: '$.questionsAndAnswers[0].question',
            contains: 'SINGLE_QUESTION_ON_A_PAGE',
          },
        },
        {
          matchesJsonPath: {
            expression: '$.questionsAndAnswers[0].answer.answer',
            contains: 'YES',
          },
        },
        {
          matchesJsonPath: {
            expression: '$.questionsAndAnswers[1].question',
            contains: 'MULTIPLE_QUESTIONS_ON_A_PAGE',
          },
        },
        {
          matchesJsonPath: {
            expression: '$.questionsAndAnswers[1].answer.answer',
            contains: 'NO',
          },
        },
        {
          matchesJsonPath: {
            expression: '$.questionsAndAnswers[2].question',
            contains: 'ADDRESS_QUESTION',
          },
        },
        {
          matchesJsonPath: {
            expression: '$.questionsAndAnswers[2].answer.answer',
            contains: 'line1',
          },
        },
        {
          matchesJsonPath: {
            expression: '$.questionsAndAnswers[3].question',
            contains: 'NESTED_RADIO_QUESTION_TYPES',
          },
        },
        {
          matchesJsonPath: {
            expression: '$.questionsAndAnswers[3].answer.answer',
            contains: 'NO',
          },
        },
        {
          matchesJsonPath: {
            expression: '$.questionsAndAnswers[4].question',
            contains: 'LONG_TEXT_QUESTION',
          },
        },
        {
          matchesJsonPath: {
            expression: '$.questionsAndAnswers[4].answer.answer',
            contains: 'Random text',
          },
        },
        {
          matchesJsonPath: {
            expression: '$.questionsAndAnswers[5].question',
            contains: 'CHECKBOX_QUESTION_WITH_EXCLUSIVE_OPTIONS',
          },
        },
        {
          matchesJsonPath: {
            expression: '$.questionsAndAnswers[5].answer.answer',
            contains: 'UNIVERSAL_CREDIT',
          },
        },
        {
          matchesJsonPath: {
            expression: '$.questionsAndAnswers[6].question',
            contains: 'DIVERGENT_FLOW_OPTIONS',
          },
        },
        {
          matchesJsonPath: {
            expression: '$.questionsAndAnswers[6].answer.answer',
            contains: 'YES',
          },
        },
        {
          matchesJsonPath: {
            expression: '$.questionsAndAnswers[7].question',
            contains: 'DIVERGENT_OPTION',
          },
        },
        {
          matchesJsonPath: {
            expression: '$.questionsAndAnswers[7].answer.answer',
            contains: 'PHYSICAL_HEALTH',
          },
        },
        {
          matchesJsonPath: {
            expression: '$.questionsAndAnswers[8].question',
            contains: 'MANDATORY_QUESTION',
          },
        },
        {
          matchesJsonPath: {
            expression: '$.questionsAndAnswers[8].answer.answer',
            contains: 'SUPPORT_REQUIRED',
          },
        },
        {
          matchesJsonPath: {
            expression: '$.questionsAndAnswers[9].question',
            contains: 'OPTIONAL_QUESTION',
          },
        },
        {
          matchesJsonPath: {
            expression: '$.questionsAndAnswers[9].answer.answer',
            contains: 'NO_ANSWER',
          },
        },
        {
          matchesJsonPath: {
            expression: '$.questionsAndAnswers[10].question',
            contains: 'SUPPORT_NEEDS',
          },
        },
        {
          matchesJsonPath: {
            expression: '$.questionsAndAnswers[10].answer.answer',
            contains: 'SUPPORT_REQUIRED',
          },
        },
        {
          matchesJsonPath: {
            expression: '$.questionsAndAnswers[11].question',
            contains: 'CASE_NOTE_SUMMARY',
          },
        },
        {
          matchesJsonPath: {
            expression: '$.questionsAndAnswers[11].answer.answer',
            contains: 'Case Note',
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

const singleQuestionOnPage = () =>
  stubFor({
    name: 'Single question on a page, radio question',
    request: {
      method: 'GET',
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/ACCOMMODATION/page/SINGLE_QUESTION_ON_A_PAGE?assessmentType=BCST2&version=1',
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
              validation: { type: 'MANDATORY' },
            },
            answer: { '@class': 'StringAnswer', answer: 'NO' },
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
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/ACCOMMODATION/page/MULTIPLE_QUESTIONS_ON_A_PAGE?assessmentType=BCST2&version=1',
    },
    response: {
      status: 200,
      headers: responseHeaders,
      jsonBody: {
        id: 'MULTIPLE_QUESTIONS_ON_A_PAGE',
        title: null,
        questionsAndAnswers: [
          {
            question: {
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
                  nestedQuestions: [
                    {
                      question: {
                        id: 'REGEX_NUMBER',
                        title: 'Number Regex',
                        subTitle: null,
                        type: 'SHORT_TEXT',
                        options: null,
                        validation: {
                          type: 'MANDATORY',
                          regex: '^(?:[1-9])(\\d+)?$',
                          message: 'Number must be a whole number',
                        },
                        detailsTitle: null,
                        detailsContent: null,
                      },
                      answer: { '@class': 'StringAnswer', answer: '4' },
                      originalPageId: 'MULTIPLE_QUESTIONS_ON_A_PAGE',
                    },
                  ],
                  freeText: false,
                  tag: null,
                },
                {
                  id: 'NO',
                  displayText: 'No',
                  description: null,
                  exclusive: false,
                  nestedQuestions: null,
                  freeText: false,
                  tag: null,
                },
                {
                  id: 'NO_ANSWER',
                  displayText: 'No answer provided',
                  description: null,
                  exclusive: false,
                  nestedQuestions: null,
                  freeText: false,
                  tag: null,
                },
              ],
              validation: { type: 'MANDATORY' },
              detailsTitle: null,
              detailsContent: null,
            },
            answer: { '@class': 'StringAnswer', answer: 'YES' },
            originalPageId: 'MULTIPLE_QUESTIONS_ON_A_PAGE',
          },
          {
            question: {
              id: 'ADDRESS_QUESTION',
              title: 'Address question: Enter the address',
              subTitle: null,
              type: 'ADDRESS',
              options: null,
              validation: { type: 'MANDATORY' },
              detailsTitle: null,
              detailsContent: null,
            },
            answer: {
              answer: [{ addressLine1: '123 Main Street' }, { addressPostcode: 'AB1 2BC' }],
              '@class': 'MapAnswer',
            },
            originalPageId: 'MULTIPLE_QUESTIONS_ON_A_PAGE',
          },
          {
            question: {
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
                  nestedQuestions: [
                    {
                      question: {
                        id: 'SHORT_TEXT_NESTED',
                        title: 'Short text nested',
                        subTitle: null,
                        type: 'SHORT_TEXT',
                        options: null,
                        validation: { type: 'MANDATORY' },
                        detailsTitle: null,
                        detailsContent: null,
                      },
                      answer: { '@class': 'StringAnswer', answer: 'Some short text' },
                      originalPageId: 'MULTIPLE_QUESTIONS_ON_A_PAGE',
                    },
                    {
                      question: {
                        id: 'ADDRESS_NESTED',
                        title: 'Enter the address nested',
                        subTitle: null,
                        type: 'ADDRESS',
                        options: null,
                        validation: { type: 'MANDATORY' },
                        detailsTitle: null,
                        detailsContent: null,
                      },
                      answer: {
                        answer: [{ addressLine1: '1 Main Street' }, { addressPostcode: 'BC1 2DE' }],
                        '@class': 'MapAnswer',
                      },
                      originalPageId: 'MULTIPLE_QUESTIONS_ON_A_PAGE',
                    },
                    {
                      question: {
                        id: 'LONG_TEXT_NESTED',
                        title: 'Long text nested',
                        subTitle: null,
                        type: 'LONG_TEXT',
                        options: null,
                        validation: { type: 'MANDATORY' },
                        detailsTitle: null,
                        detailsContent: null,
                      },
                      answer: { '@class': 'StringAnswer', answer: 'Some long text' },
                      originalPageId: 'MULTIPLE_QUESTIONS_ON_A_PAGE',
                    },
                  ],
                  freeText: false,
                  tag: null,
                },
                {
                  id: 'NO',
                  displayText: 'No',
                  description: null,
                  exclusive: false,
                  nestedQuestions: null,
                  freeText: false,
                  tag: null,
                },
                {
                  id: 'NO_ANSWER',
                  displayText: 'No answer provided',
                  description: null,
                  exclusive: false,
                  nestedQuestions: null,
                  freeText: false,
                  tag: null,
                },
              ],
              validation: { type: 'MANDATORY' },
              detailsTitle: null,
              detailsContent: null,
            },
            answer: { '@class': 'StringAnswer', answer: 'YES' },
            originalPageId: 'MULTIPLE_QUESTIONS_ON_A_PAGE',
          },
          {
            question: {
              id: 'LONG_TEXT_QUESTION',
              title: 'Long Text Question',
              subTitle: 'This will be displayed as a case note in both DPS and nDelius',
              type: 'LONG_TEXT',
              options: null,
              validation: { type: 'MANDATORY' },
              detailsTitle: null,
              detailsContent: null,
            },
            answer: { '@class': 'StringAnswer', answer: 'Initial text' },
            originalPageId: 'MULTIPLE_QUESTIONS_ON_A_PAGE',
          },
          {
            question: {
              id: 'CHECKBOX_QUESTION_WITH_EXCLUSIVE_OPTIONS',
              title: 'Checkbox question with exclusive options?',
              subTitle: 'Select all that apply',
              type: 'CHECKBOX',
              options: [
                {
                  id: 'ESA',
                  displayText: 'Employment and support allowance (ESA)',
                  description: null,
                  exclusive: false,
                  nestedQuestions: null,
                  freeText: false,
                  tag: null,
                },
                {
                  id: 'HOUSING_BENEFIT',
                  displayText: 'Housing benefit',
                  description: null,
                  exclusive: false,
                  nestedQuestions: null,
                  freeText: false,
                  tag: null,
                },
                {
                  id: 'UNIVERSAL_CREDIT_HOUSING_ELEMENT',
                  displayText: 'Universal credit housing element',
                  description: null,
                  exclusive: false,
                  nestedQuestions: null,
                  freeText: false,
                  tag: null,
                },
                {
                  id: 'UNIVERSAL_CREDIT',
                  displayText: 'Universal credit',
                  description: null,
                  exclusive: false,
                  nestedQuestions: null,
                  freeText: false,
                  tag: null,
                },
                {
                  id: 'PIP',
                  displayText: 'Personal independence payment (PIP)',
                  description: null,
                  exclusive: false,
                  nestedQuestions: null,
                  freeText: false,
                  tag: null,
                },
                {
                  id: 'STATE_PENSION',
                  displayText: 'State pension',
                  description: null,
                  exclusive: false,
                  nestedQuestions: null,
                  freeText: false,
                  tag: null,
                },
                {
                  id: 'NO_BENEFITS',
                  displayText: 'No benefits',
                  description: null,
                  exclusive: true,
                  nestedQuestions: null,
                  freeText: false,
                  tag: null,
                },
                {
                  id: 'NO_ANSWER',
                  displayText: 'No answer provided',
                  description: null,
                  exclusive: true,
                  nestedQuestions: null,
                  freeText: false,
                  tag: null,
                },
              ],
              validation: { type: 'MANDATORY' },
              detailsTitle: null,
              detailsContent: null,
            },
            answer: { '@class': 'StringAnswer', answer: 'NO_BENEFITS' },
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
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/ACCOMMODATION/page/DIVERGENT_FLOW_OPTIONS?assessmentType=BCST2&version=1',
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
                  nestedQuestions: null,
                  freeText: false,
                  tag: null,
                },
                {
                  id: 'NO',
                  displayText: 'No',
                  description: null,
                  exclusive: false,
                  nestedQuestions: null,
                  freeText: false,
                  tag: null,
                },
                {
                  id: 'NO_ANSWER',
                  displayText: 'No answer provided',
                  description: null,
                  exclusive: false,
                  nestedQuestions: null,
                  freeText: false,
                  tag: null,
                },
              ],
              validation: { type: 'MANDATORY' },
              detailsTitle: null,
              detailsContent: null,
            },
            answer: { '@class': 'StringAnswer', answer: 'YES' },
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
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/ACCOMMODATION/page/DIVERGENT_OPTION?assessmentType=BCST2&version=1',
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
                  nestedQuestions: null,
                  freeText: false,
                  tag: null,
                },
                {
                  id: 'MENTAL_HEALTH',
                  displayText: 'Mental health',
                  description: null,
                  exclusive: false,
                  nestedQuestions: null,
                  freeText: false,
                  tag: null,
                },
                {
                  id: 'NO_ANSWER',
                  displayText: 'No answer provided',
                  description: null,
                  exclusive: true,
                  nestedQuestions: null,
                  freeText: false,
                  tag: null,
                },
              ],
              validation: { type: 'MANDATORY' },
              detailsTitle: null,
              detailsContent: null,
            },
            answer: { '@class': 'StringAnswer', answer: 'NO_ANSWER' },
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
      url: '/rpApi/resettlement-passport/prisoner/A8731DY/resettlement-assessment/ACCOMMODATION/page/MANDATORY_AND_OPTIONAL_QUESTIONS?assessmentType=BCST2&version=1',
    },
    response: {
      status: 200,
      headers: responseHeaders,
      jsonBody: {
        id: 'MANDATORY_AND_OPTIONAL_QUESTIONS',
        title: 'Mandatory and optional questions',
        questionsAndAnswers: [
          {
            question: {
              id: 'MANDATORY_QUESTION',
              title: 'Mandatory question status',
              subTitle: 'Select one option.',
              type: 'RADIO',
              options: [
                {
                  id: 'SUPPORT_REQUIRED',
                  displayText: 'Support required',
                  description: 'a need for support has been identified and is accepted',
                  exclusive: false,
                  nestedQuestions: null,
                  freeText: false,
                  tag: null,
                },
                {
                  id: 'SUPPORT_NOT_REQUIRED',
                  displayText: 'Support not required',
                  description: 'no need was identified',
                  exclusive: false,
                  nestedQuestions: null,
                  freeText: false,
                  tag: null,
                },
                {
                  id: 'SUPPORT_DECLINED',
                  displayText: 'Support declined',
                  description: 'a need has been identified but support is declined',
                  exclusive: false,
                  nestedQuestions: null,
                  freeText: false,
                  tag: null,
                },
              ],
              validation: { type: 'MANDATORY' },
              detailsTitle: null,
              detailsContent: null,
            },
            answer: { '@class': 'StringAnswer', answer: 'SUPPORT_NOT_REQUIRED' },
            originalPageId: 'MANDATORY_AND_OPTIONAL_QUESTIONS',
          },
          {
            question: {
              id: 'OPTIONAL_QUESTION',
              title: 'This is an optional question to enter address select move to new address?',
              subTitle: null,
              type: 'RADIO',
              options: [
                {
                  id: 'RETURN_TO_PREVIOUS_ADDRESS',
                  displayText: 'Return to their previous address',
                  description: null,
                  exclusive: false,
                  nestedQuestions: null,
                  freeText: false,
                  tag: null,
                },
                {
                  id: 'MOVE_TO_NEW_ADDRESS',
                  displayText: 'Move to a new address',
                  description: null,
                  exclusive: false,
                  nestedQuestions: [
                    {
                      question: {
                        id: 'WHERE_WILL_THEY_LIVE_ADDRESS_MOVE_TO_NEW_ADDRESS',
                        title: 'Optional Question enter address?',
                        subTitle: null,
                        type: 'ADDRESS',
                        options: null,
                        validation: { type: 'MANDATORY' },
                        detailsTitle: null,
                        detailsContent: null,
                      },
                      answer: {
                        answer: [{ addressLine1: '1 Main Street' }, { addressPostcode: 'BC1 2DE' }],
                        '@class': 'MapAnswer',
                      },
                      originalPageId: 'MANDATORY_AND_OPTIONAL_QUESTIONS',
                    },
                  ],
                  freeText: false,
                  tag: null,
                },
                {
                  id: 'DOES_NOT_HAVE_ANYWHERE',
                  displayText: 'Does not have anywhere to live',
                  description: null,
                  exclusive: false,
                  nestedQuestions: null,
                  freeText: false,
                  tag: null,
                },
                {
                  id: 'NO_ANSWER',
                  displayText: 'No answer provided',
                  description: null,
                  exclusive: false,
                  nestedQuestions: null,
                  freeText: false,
                  tag: null,
                },
              ],
              validation: { type: 'MANDATORY' },
              detailsTitle: null,
              detailsContent: null,
            },
            answer: { '@class': 'StringAnswer', answer: 'MOVE_TO_NEW_ADDRESS' },
            originalPageId: 'MANDATORY_AND_OPTIONAL_QUESTIONS',
          },
        ],
      },
    },
  })

export const johnSmithImmediateNeedsReportAllQuestionTypesCompleted = (): SuperAgentRequest[] => [
  stubJohnSmithPrisonerDetailsComplete(),
  getAccommodation(),
  nextPageStartAllQuestionTypes(),
  singleQuestionOnPage(),
  postSingleQuestionOnAPage(),
  multipleQuestionsOnPage(),
  postMultipleQuestionsOnAPage(),
  divergentFlowOptions(),
  postDivergentFlowOptionYes(),
  divergentOptionYes(),
  postDivergentAnswerYes(),
  mandatoryAndOptionalQuestionsPage(),
  postMandatoryAndOptionalQuestionsPage(),
  assessmentSummaryPage('ACCOMMODATION', 'Accommodation'),
  nextPageSummary('ACCOMMODATION'),
  checkAnswersPage('ACCOMMODATION'),
  submitAllQuestionTypesAssessment(),
  nextPageHelpToKeepHome(),
  getResettlementAssessmentVersion('ACCOMMODATION', 'BCST2'),
  validateAssessment('ACCOMMODATION', 'BCST2'),
]

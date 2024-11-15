import { JSDOM } from 'jsdom'
import type { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes } from '../testutils/appSetup'

import RpService from '../../services/rpService'
import { AssessmentStateService } from '../../data/assessmentStateService'
import {
  ApiAssessmentPage,
  CachedAssessment,
  CachedQuestionAndAnswer,
  WorkingCachedAssessment,
} from '../../data/model/immediateNeedsReport'
import Config from '../../s3Config'
import { configHelper } from '../configHelperTest'
import { stubPrisonerDetails } from '../testutils/testUtils'

let app: Express
let rpService: jest.Mocked<RpService>
let assessmentStateService: jest.Mocked<AssessmentStateService>
const config: jest.Mocked<Config> = new Config() as jest.Mocked<Config>

beforeEach(() => {
  rpService = new RpService() as jest.Mocked<RpService>
  assessmentStateService = new AssessmentStateService(null) as jest.Mocked<AssessmentStateService>
  configHelper(config)
  stubPrisonerDetails(rpService)

  app = appWithAllRoutes({
    services: {
      rpService,
      assessmentStateService,
    },
  })
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('completeAssessment', () => {
  it('should submit the assessment to the backend then redirect to the task list', async () => {
    const workingCachedAssessment: WorkingCachedAssessment = {
      assessment: {
        questionsAndAnswers: [
          {
            question: '1',
            answer: { answer: 'YES', '@class': 'StringAnswer', displayText: 'Yes' },
            pageId: 'page1',
            questionTitle: 'question',
            questionType: 'RADIO',
          },
        ],
        version: 1,
      },
      pageLoadHistory: [{ pageId: 'Page1', questions: ['1'] }],
    }
    jest.spyOn(assessmentStateService, 'getWorkingAssessment').mockResolvedValue(workingCachedAssessment)

    const completeAssessmentSpy = jest.spyOn(rpService, 'completeAssessment').mockResolvedValue({})
    jest.spyOn(assessmentStateService, 'onComplete').mockImplementation()

    await request(app)
      .post('/ImmediateNeedsReport/pathway/DRUGS_AND_ALCOHOL/complete?prisonerNumber=123')
      .send({
        assessmentType: 'BCST2',
      })
      .expect(302)
      .expect(res => {
        expect(res.text).toContain('Found. Redirecting to /assessment-task-list?prisonerNumber=123&type=BCST2')
      })

    expect(completeAssessmentSpy).toHaveBeenCalledWith(
      '123',
      'DRUGS_AND_ALCOHOL',
      workingCachedAssessment.assessment,
      'BCST2',
    )
  })

  it('it should not submit the assessment if there is no submitted input', async () => {
    const workingCachedAssessment = {
      assessment: { questionsAndAnswers: [], version: null },
      pageLoadHistory: [],
    } as WorkingCachedAssessment

    jest.spyOn(assessmentStateService, 'getWorkingAssessment').mockResolvedValue(workingCachedAssessment)

    const completeAssessmentSpy = jest.spyOn(rpService, 'completeAssessment').mockResolvedValue({})

    await request(app)
      .post('/ImmediateNeedsReport/pathway/DRUGS_AND_ALCOHOL/complete?prisonerNumber=123')
      .send({
        assessmentType: 'BCST2',
      })
      .expect(500)
      .expect(res => expect(res.text).toMatchSnapshot())

    expect(completeAssessmentSpy).toHaveBeenCalledWith(
      '123',
      'DRUGS_AND_ALCOHOL',
      workingCachedAssessment.assessment,
      'BCST2',
    )
  })
})

describe('getFirstPage', () => {
  it('Uses default version 1 when there is no version in the cache', async () => {
    const workingCacheAssessment = {
      assessment: {
        questionsAndAnswers: [
          {
            question: '1',
            answer: { answer: 'YES', '@class': 'StringAnswer', displayText: 'Yes' },
            pageId: 'page1',
            questionTitle: 'question',
            questionType: 'RADIO',
          },
        ],
        version: null,
      },
      pageLoadHistory: [{ pageId: 'page1', questions: ['1'] }],
    } as WorkingCachedAssessment

    const checkYourAnswersApiAssessmentPage = {
      id: 'CHECK_ANSWERS',
      questionsAndAnswers: [],
    } as ApiAssessmentPage

    const getLatestAssessmentVersionSpy = jest.spyOn(rpService, 'getLatestAssessmentVersion').mockResolvedValue(2)
    const getAssessmentPageSpy = jest
      .spyOn(rpService, 'getAssessmentPage')
      .mockResolvedValue(checkYourAnswersApiAssessmentPage)
    const initialiseCacheSpy = jest
      .spyOn(assessmentStateService, 'initialiseCache')
      .mockResolvedValue(workingCacheAssessment)
    const fetchNextPageSpy = jest.spyOn(rpService, 'fetchNextPage')

    await request(app)
      .get('/ImmediateNeedsReport-next-page?type=BCST2&pathway=ACCOMMODATION&prisonerNumber=123')
      .expect(302)
      .expect(res => {
        expect(res.text).toContain(
          'Found. Redirecting to /ImmediateNeedsReport/pathway/ACCOMMODATION/page/page1?prisonerNumber=123&type=BCST2',
        )
      })

    expect(getLatestAssessmentVersionSpy).toHaveBeenCalledWith('123', 'BCST2', 'ACCOMMODATION')
    expect(getAssessmentPageSpy).toHaveBeenCalledWith('123', 'ACCOMMODATION', 'CHECK_ANSWERS', 'BCST2', 2)
    expect(initialiseCacheSpy).toHaveBeenCalledWith(
      {
        assessmentType: 'BCST2',
        prisonerNumber: '123',
        userId: 'user1',
        pathway: 'ACCOMMODATION',
      },
      2,
      [],
    )
    expect(fetchNextPageSpy).toHaveBeenCalledTimes(0)
  })
})

describe('getView', () => {
  it('should use version 1 when existing assessment in cache has no version', async () => {
    const stateKey = {
      assessmentType: 'BCST2',
      prisonerNumber: '123',
      userId: 'user1',
      pathway: 'ACCOMMODATION',
    }

    const getWorkingAssessmentVersionSpy = jest
      .spyOn(assessmentStateService, 'getWorkingAssessmentVersion')
      .mockResolvedValue(undefined)

    const apiAssessmentPage = {
      id: 'MY_PAGE',
      title: 'My page',
      questionsAndAnswers: [
        {
          question: {
            id: 'QUESTION_1',
            title: 'Question 1',
            type: 'LONG_TEXT',
          },
          originalPageId: 'MY_PAGE',
        },
      ],
    } as ApiAssessmentPage
    const getAssessmentPageSpy = jest.spyOn(rpService, 'getAssessmentPage').mockResolvedValue(apiAssessmentPage)

    const checkForConvergenceSpy = jest.spyOn(assessmentStateService, 'checkForConvergence').mockResolvedValue(false)

    const updatePageLoadHistorySpy = jest.spyOn(assessmentStateService, 'updatePageLoadHistory').mockImplementation()

    const mergedQuestionsAndAnswers = [
      {
        question: 'QUESTION_1',
        questionTitle: 'Question 1',
        pageId: 'PAGE_1',
        questionType: 'LONG_TEXT',
        answer: {
          answer: 'Some long text here',
          displayText: 'Some long text here',
          '@class': 'StringAnswer',
        },
      },
    ] as CachedQuestionAndAnswer[]
    const getMergedQuestionsAndAnswersSpy = jest
      .spyOn(assessmentStateService, 'getMergedQuestionsAndAnswers')
      .mockResolvedValue(mergedQuestionsAndAnswers)

    await request(app)
      .get(
        `/ImmediateNeedsReport/pathway/${stateKey.pathway}/page/THE_PAGE?prisonerNumber=${stateKey.prisonerNumber}&pathway=${stateKey.pathway}&type=BCST2`,
      )
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())

    expect(getWorkingAssessmentVersionSpy).toHaveBeenCalledWith(stateKey)
    expect(getAssessmentPageSpy).toHaveBeenCalledWith(stateKey.prisonerNumber, stateKey.pathway, 'THE_PAGE', 'BCST2', 1)
    expect(checkForConvergenceSpy).toHaveBeenCalledWith(stateKey, {
      pageId: 'MY_PAGE',
      questions: ['QUESTION_1'],
    })
    expect(updatePageLoadHistorySpy).toHaveBeenCalledWith(stateKey, {
      pageId: 'MY_PAGE',
      questions: ['QUESTION_1'],
    })
    expect(getMergedQuestionsAndAnswersSpy).toHaveBeenCalledWith(stateKey, apiAssessmentPage.questionsAndAnswers)
  })

  it('get check your answers - v1 of report', async () => {
    const stateKey = {
      assessmentType: 'BCST2',
      prisonerNumber: '123',
      userId: 'user1',
      pathway: 'ACCOMMODATION',
    }

    const getWorkingAssessmentVersionSpy = jest
      .spyOn(assessmentStateService, 'getWorkingAssessmentVersion')
      .mockResolvedValue(1)

    const apiAssessmentPage = {
      id: 'CHECK_ANSWERS',
      title: '',
      questionsAndAnswers: [
        {
          question: {
            id: 'QUESTION_1',
            title: 'Question 1',
            type: 'LONG_TEXT',
          },
          originalPageId: 'PAGE_1',
        },
        {
          question: {
            id: 'QUESTION_2',
            title: 'Question 2',
            type: 'SHORT_TEXT',
          },
          originalPageId: 'PAGE_1',
        },
        {
          question: {
            id: 'QUESTION_3',
            title: 'Question 3',
            type: 'RADIO',
            options: [
              {
                id: 'R_OPTION_1',
                displayText: 'Radio option 1',
              },
              {
                id: 'R_OPTION_2',
                displayText: 'Radio option 2',
              },
            ],
          },
          originalPageId: 'PAGE_2',
        },
        {
          question: {
            id: 'QUESTION_4',
            title: 'Question 4',
            type: 'CHECKBOX',
            options: [
              {
                id: 'C_OPTION_1',
                displayText: 'Checkbox option 1',
              },
              {
                id: 'C_OPTION_2',
                displayText: 'Checkbox option 2',
              },
              {
                id: 'C_OPTION_3',
                displayText: 'Checkbox option 3',
              },
              {
                id: 'OTHER',
                displayText: 'Other',
                freeText: true,
              },
            ],
          },
          originalPageId: 'PAGE_2',
        },
        {
          question: {
            id: 'QUESTION_5',
            title: 'Question 5',
            type: 'ADDRESS',
          },
          originalPageId: 'PAGE_3',
        },
        {
          question: {
            id: 'SUPPORT_NEEDS',
            title: 'Support needs',
            type: 'RADIO',
            options: [
              {
                id: 'SUPPORT_REQUIRED',
                displayText: 'Support required',
                description: 'a need for support has been identified and is accepted',
              },
              {
                id: 'SUPPORT_NOT_REQUIRED',
                displayText: 'Support not required',
                description: 'no need was identified',
              },
              {
                id: 'SUPPORT_DECLINED',
                displayText: 'Support declined',
                description: 'a need has been identified but support is declined',
              },
            ],
          },
          originalPageId: 'ASSESSMENT_SUMMARY',
        },
        {
          question: {
            id: 'CASE_NOTE_SUMMARY',
            title: 'Case note summary',
            type: 'LONG_TEXT',
          },
          originalPageId: 'ASSESSMENT_SUMMARY',
        },
      ],
    } as ApiAssessmentPage
    const getAssessmentPageSpy = jest.spyOn(rpService, 'getAssessmentPage').mockResolvedValue(apiAssessmentPage)

    const checkForConvergenceSpy = jest.spyOn(assessmentStateService, 'checkForConvergence').mockResolvedValue(false)

    const workingAssessmentAnsweredQuestions: CachedAssessment = {
      questionsAndAnswers: [
        {
          question: 'QUESTION_1',
          questionTitle: 'Question 1',
          pageId: 'PAGE_1',
          questionType: 'LONG_TEXT',
          answer: {
            answer: 'This is the answer to question 1',
            displayText: 'This is the answer to question 1',
            '@class': 'StringAnswer',
          },
        },
        {
          question: 'QUESTION_2',
          questionTitle: 'Question 2',
          pageId: 'PAGE_1',
          questionType: 'SHORT_TEXT',
          answer: {
            answer: 'This is the answer to question 2',
            displayText: 'This is the answer to question 2',
            '@class': 'StringAnswer',
          },
        },
        {
          question: 'QUESTION_3',
          questionTitle: 'Question 3',
          pageId: 'PAGE_2',
          questionType: 'RADIO',
          answer: {
            answer: 'R_OPTION_1',
            displayText: 'Radio option 1',
            '@class': 'StringAnswer',
          },
        },
        {
          question: 'QUESTION_4',
          questionTitle: 'Question 4',
          pageId: 'PAGE_2',
          questionType: 'CHECKBOX',
          answer: {
            answer: ['C_OPTION_1', 'C_OPTION_2', 'OTHER_SUPPORT_NEEDS: Another support need'],
            displayText: ['Checkbox option 1', 'Checkbox option 2'],
            '@class': 'ListAnswer',
          },
        },
        {
          question: 'QUESTION_5',
          questionTitle: 'Question 5',
          pageId: 'PAGE_3',
          questionType: 'ADDRESS',
          answer: {
            answer: [{ addressLine1: '123 Main Street' }, { postcode: 'AB1 2BC' }],
            displayText: null,
            '@class': 'MapAnswer',
          },
        },
        {
          question: 'SUPPORT_NEEDS',
          questionTitle: 'Support needs',
          pageId: 'ASSESSMENT_SUMMARY',
          questionType: 'RADIO',
          answer: {
            answer: 'SUPPORT_REQUIRED',
            displayText: 'Support required',
            '@class': 'StringAnswer',
          },
        },
        {
          question: 'CASE_NOTE_SUMMARY',
          questionTitle: 'Case note summary',
          pageId: 'ASSESSMENT_SUMMARY',
          questionType: 'LONG_TEXT',
          answer: {
            answer: 'SUPPORT_REQUIRED',
            displayText: 'This is the case note summary',
            '@class': 'StringAnswer',
          },
        },
      ],
      version: 1,
    }

    const getAllAnsweredQuestionsFromCacheSpy = jest
      .spyOn(assessmentStateService, 'getAllAnsweredQuestionsFromCache')
      .mockResolvedValue(workingAssessmentAnsweredQuestions)

    const validateAssessmentSpy = jest.spyOn(rpService, 'validateAssessment').mockResolvedValue({ valid: true })

    const updateCachesOnCheckYourAnswersSpy = jest
      .spyOn(assessmentStateService, 'updateCachesOnCheckYourAnswers')
      .mockImplementation()

    await request(app)
      .get(
        `/ImmediateNeedsReport/pathway/${stateKey.pathway}/page/CHECK_ANSWERS?prisonerNumber=${stateKey.prisonerNumber}&pathway=${stateKey.pathway}&type=${stateKey.assessmentType}`,
      )
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())

    expect(getWorkingAssessmentVersionSpy).toHaveBeenCalledWith(stateKey)
    expect(getAssessmentPageSpy).toHaveBeenCalledWith(
      stateKey.prisonerNumber,
      stateKey.pathway,
      'CHECK_ANSWERS',
      stateKey.assessmentType,
      1,
    )
    expect(checkForConvergenceSpy).toHaveBeenCalledWith(stateKey, {
      pageId: 'CHECK_ANSWERS',
      questions: [
        'QUESTION_1',
        'QUESTION_2',
        'QUESTION_3',
        'QUESTION_4',
        'QUESTION_5',
        'SUPPORT_NEEDS',
        'CASE_NOTE_SUMMARY',
      ],
    })
    expect(getAllAnsweredQuestionsFromCacheSpy).toHaveBeenCalledWith(stateKey, 'working')
    expect(validateAssessmentSpy).toHaveBeenCalledWith(
      stateKey.prisonerNumber,
      stateKey.pathway,
      workingAssessmentAnsweredQuestions,
      stateKey.assessmentType,
    )
    expect(updateCachesOnCheckYourAnswersSpy).toHaveBeenCalledWith(
      stateKey,
      workingAssessmentAnsweredQuestions.questionsAndAnswers,
    )
  })
  it('get check your answers - v2 of report', async () => {
    const stateKey = {
      assessmentType: 'RESETTLEMENT_PLAN',
      prisonerNumber: '123',
      userId: 'user1',
      pathway: 'ACCOMMODATION',
    }

    const getWorkingAssessmentVersionSpy = jest
      .spyOn(assessmentStateService, 'getWorkingAssessmentVersion')
      .mockResolvedValue(2)

    const apiAssessmentPage = {
      id: 'CHECK_ANSWERS',
      title: '',
      questionsAndAnswers: [
        {
          question: {
            id: 'QUESTION_1',
            title: 'Question 1',
            type: 'LONG_TEXT',
          },
          originalPageId: 'PAGE_1',
        },
        {
          question: {
            id: 'QUESTION_2',
            title: 'Question 2',
            type: 'SHORT_TEXT',
          },
          originalPageId: 'PAGE_1',
        },
        {
          question: {
            id: 'QUESTION_3',
            title: 'Question 3',
            type: 'RADIO',
            options: [
              {
                id: 'R_OPTION_1',
                displayText: 'Radio option 1',
              },
              {
                id: 'R_OPTION_2',
                displayText: 'Radio option 2',
              },
            ],
          },
          originalPageId: 'PAGE_2',
        },
        {
          question: {
            id: 'QUESTION_4',
            title: 'Question 4',
            type: 'CHECKBOX',
            options: [
              {
                id: 'C_OPTION_1',
                displayText: 'Checkbox option 1',
              },
              {
                id: 'C_OPTION_2',
                displayText: 'Checkbox option 2',
              },
              {
                id: 'C_OPTION_3',
                displayText: 'Checkbox option 3',
              },
            ],
          },
          originalPageId: 'PAGE_2',
        },
        {
          question: {
            id: 'QUESTION_4_ADDITIONAL_DETAILS',
            title: 'Question 4 Additional details',
            type: 'LONG_TEXT',
          },
          originalPageId: 'PAGE_2',
        },
        {
          question: {
            id: 'QUESTION_5',
            title: 'Question 5',
            type: 'ADDRESS',
          },
          originalPageId: 'PAGE_3',
        },
        {
          question: {
            id: 'SUPPORT_REQUIREMENTS',
            title: 'Support needs',
            type: 'CHECKBOX',
            options: [
              {
                id: 'NEED_OPTION_1',
                displayText: 'Support need 1',
              },
              {
                id: 'NEED_OPTION_2',
                displayText: 'Support need 2',
              },
            ],
          },
          originalPageId: 'SUPPORT_REQUIREMENTS',
        },
        {
          question: {
            id: 'SUPPORT_NEEDS_PRERELEASE',
            title: 'Report summary',
            type: 'RADIO',
            options: [
              {
                id: 'SUPPORT_REQUIRED',
                displayText: 'Support required',
                description: 'a need for support has been identified and is accepted',
              },
              {
                id: 'SUPPORT_NOT_REQUIRED',
                displayText: 'Support not required',
                description: 'no need was identified',
              },
              {
                id: 'SUPPORT_DECLINED',
                displayText: 'Support declined',
                description: 'a need has been identified but support is declined',
              },
              {
                id: 'IN_PROGRESS',
                displayText: 'In progress',
                description: 'work is ongoing',
              },
              {
                id: 'DONE',
                displayText: 'Done',
                description: 'all required work has been completed successfully',
              },
            ],
          },
          originalPageId: 'PRERELEASE_ASSESSMENT_SUMMARY',
        },
      ],
    } as ApiAssessmentPage
    const getAssessmentPageSpy = jest.spyOn(rpService, 'getAssessmentPage').mockResolvedValue(apiAssessmentPage)

    const checkForConvergenceSpy = jest.spyOn(assessmentStateService, 'checkForConvergence').mockResolvedValue(false)

    const workingAssessmentAnsweredQuestions: CachedAssessment = {
      questionsAndAnswers: [
        {
          question: 'QUESTION_1',
          questionTitle: 'Question 1',
          pageId: 'PAGE_1',
          questionType: 'LONG_TEXT',
          answer: {
            answer: 'This is the answer to question 1',
            displayText: 'This is the answer to question 1',
            '@class': 'StringAnswer',
          },
        },
        {
          question: 'QUESTION_2',
          questionTitle: 'Question 2',
          pageId: 'PAGE_1',
          questionType: 'SHORT_TEXT',
          answer: {
            answer: 'This is the answer to question 2',
            displayText: 'This is the answer to question 2',
            '@class': 'StringAnswer',
          },
        },
        {
          question: 'QUESTION_3',
          questionTitle: 'Question 3',
          pageId: 'PAGE_2',
          questionType: 'RADIO',
          answer: {
            answer: 'R_OPTION_1',
            displayText: 'Radio option 1',
            '@class': 'StringAnswer',
          },
        },
        {
          question: 'QUESTION_4',
          questionTitle: 'Question 4',
          pageId: 'PAGE_2',
          questionType: 'CHECKBOX',
          answer: {
            answer: ['C_OPTION_1', 'C_OPTION_2'],
            displayText: ['Checkbox option 1', 'Checkbox option 2'],
            '@class': 'ListAnswer',
          },
        },
        {
          question: 'QUESTION_4_ADDITIONAL_DETAILS',
          questionTitle: 'Question 4 Additional details',
          pageId: 'PAGE_2',
          questionType: 'LONG_TEXT',
          answer: {
            answer: '',
            displayText: '',
            '@class': 'StringAnswer',
          },
        },
        {
          question: 'QUESTION_5',
          questionTitle: 'Question 5',
          pageId: 'PAGE_3',
          questionType: 'ADDRESS',
          answer: {
            answer: [{ addressLine1: '123 Main Street' }, { postcode: 'AB1 2BC' }],
            displayText: null,
            '@class': 'MapAnswer',
          },
        },
        {
          question: 'SUPPORT_REQUIREMENTS',
          questionTitle: 'Support needs',
          questionType: 'CHECKBOX',
          pageId: 'SUPPORT_REQUIREMENTS',
          answer: {
            answer: ['NEED_OPTION_1', 'NEED_OPTION_2'],
            displayText: ['Help with need 1', 'Help with need 2'],
            '@class': 'ListAnswer',
          },
        },
        {
          question: 'SUPPORT_NEEDS_PRERELEASE',
          questionTitle: 'Support needs',
          pageId: 'PRERELEASE_ASSESSMENT_SUMMARY',
          questionType: 'RADIO',
          answer: {
            answer: 'SUPPORT_NOT_REQUIRED',
            displayText: 'Support not required',
            '@class': 'StringAnswer',
          },
        },
      ],
      version: 1,
    }

    const getAllAnsweredQuestionsFromCacheSpy = jest
      .spyOn(assessmentStateService, 'getAllAnsweredQuestionsFromCache')
      .mockResolvedValue(workingAssessmentAnsweredQuestions)

    const validateAssessmentSpy = jest.spyOn(rpService, 'validateAssessment').mockResolvedValue({ valid: true })

    const updateCachesOnCheckYourAnswersSpy = jest
      .spyOn(assessmentStateService, 'updateCachesOnCheckYourAnswers')
      .mockImplementation()

    await request(app)
      .get(
        `/ImmediateNeedsReport/pathway/${stateKey.pathway}/page/CHECK_ANSWERS?prisonerNumber=${stateKey.prisonerNumber}&pathway=${stateKey.pathway}&type=${stateKey.assessmentType}`,
      )
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())

    expect(getWorkingAssessmentVersionSpy).toHaveBeenCalledWith(stateKey)
    expect(getAssessmentPageSpy).toHaveBeenCalledWith(
      stateKey.prisonerNumber,
      stateKey.pathway,
      'CHECK_ANSWERS',
      stateKey.assessmentType,
      2,
    )
    expect(checkForConvergenceSpy).toHaveBeenCalledWith(stateKey, {
      pageId: 'CHECK_ANSWERS',
      questions: [
        'QUESTION_1',
        'QUESTION_2',
        'QUESTION_3',
        'QUESTION_4',
        'QUESTION_4_ADDITIONAL_DETAILS',
        'QUESTION_5',
        'SUPPORT_REQUIREMENTS',
        'SUPPORT_NEEDS_PRERELEASE',
      ],
    })
    expect(getAllAnsweredQuestionsFromCacheSpy).toHaveBeenCalledWith(stateKey, 'working')
    expect(validateAssessmentSpy).toHaveBeenCalledWith(
      stateKey.prisonerNumber,
      stateKey.pathway,
      workingAssessmentAnsweredQuestions,
      stateKey.assessmentType,
    )
    expect(updateCachesOnCheckYourAnswersSpy).toHaveBeenCalledWith(
      stateKey,
      workingAssessmentAnsweredQuestions.questionsAndAnswers,
    )
  })

  it('should render checkboxes with unique ids', async () => {
    const stateKey = {
      assessmentType: 'BCST2',
      prisonerNumber: '123',
      userId: 'user1',
      pathway: 'FINANCE_AND_ID',
    }

    const pageResponse: ApiAssessmentPage = {
      id: 'FINANCE_AND_ID_REPORT',
      title: 'Finance and ID report',
      questionsAndAnswers: [
        {
          question: {
            id: 'HAS_BANK_ACCOUNT',
            title: 'Does the person in prison have a bank account?',
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
          answer: null,
          originalPageId: 'FINANCE_AND_ID_REPORT',
        },
        {
          question: {
            id: 'WHAT_ID_DOCUMENTS',
            title: 'What ID documents does the person in prison have?',
            subTitle: 'Select all that apply',
            type: 'CHECKBOX',
            options: [
              {
                id: 'BIRTH_CERTIFICATE',
                displayText: 'Birth or adoption certificate',
                description: null,
                exclusive: false,
                nestedQuestions: null,
                freeText: false,
                tag: null,
              },
              {
                id: 'PASSPORT',
                displayText: 'Passport',
                description: null,
                exclusive: false,
                nestedQuestions: null,
                freeText: false,
                tag: null,
              },
              {
                id: 'DRIVING_LICENCE',
                displayText: 'Driving licence',
                description: null,
                exclusive: false,
                nestedQuestions: null,
                freeText: false,
                tag: null,
              },
              {
                id: 'MARRIAGE_CERTIFICATE',
                displayText: 'Marriage or civil partnership certificate',
                description: null,
                exclusive: false,
                nestedQuestions: null,
                freeText: false,
                tag: null,
              },
              {
                id: 'DIVORCE_CERTIFICATE',
                displayText: 'Divorce decree absolute certificate',
                description: null,
                exclusive: false,
                nestedQuestions: null,
                freeText: false,
                tag: null,
              },
              {
                id: 'BIOMETRIC_RESIDENCE_PERMIT',
                displayText: 'Biometric residence permit',
                description: null,
                exclusive: false,
                nestedQuestions: null,
                freeText: false,
                tag: null,
              },
              {
                id: 'DEED_POLL_CERTIFICATE',
                displayText: 'Deed poll certificate',
                description: null,
                exclusive: false,
                nestedQuestions: null,
                freeText: false,
                tag: null,
              },
              {
                id: 'CITIZEN_CARD',
                displayText: 'CitizenCard',
                description: null,
                exclusive: false,
                nestedQuestions: null,
                freeText: false,
                tag: null,
              },
              {
                id: 'NO_ID_DOCUMENTS',
                displayText: 'No ID documents',
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
          answer: null,
          originalPageId: 'FINANCE_AND_ID_REPORT',
        },
        {
          question: {
            id: 'SELECT_BENEFITS',
            title: 'What benefits was the person in prison receiving before custody?',
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
          answer: null,
          originalPageId: 'FINANCE_AND_ID_REPORT',
        },
        {
          question: {
            id: 'DEBTS_OR_ARREARS',
            title: 'Does the person in prison have any debts or arrears?',
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
          answer: null,
          originalPageId: 'FINANCE_AND_ID_REPORT',
        },
      ],
    }
    jest.spyOn(rpService, 'getAssessmentPage').mockResolvedValue(pageResponse)
    jest.spyOn(assessmentStateService, 'checkForConvergence').mockResolvedValue(false)
    jest
      .spyOn(assessmentStateService, 'getWorkingAssessment')
      .mockResolvedValue({ assessment: { questionsAndAnswers: [], version: null }, pageLoadHistory: [] })
    jest.spyOn(assessmentStateService, 'getWorkingAssessmentVersion').mockResolvedValue(2)
    jest.spyOn(assessmentStateService, 'updatePageLoadHistory').mockImplementation()

    await request(app)
      .get(
        `/ImmediateNeedsReport/pathway/FINANCE_AND_ID/page/${stateKey.pathway}?prisonerNumber=${stateKey.prisonerNumber}&pathway=${stateKey.pathway}&type=${stateKey.assessmentType}`,
      )
      .expect(200)
      .expect(res => {
        const { document } = new JSDOM(res.text).window
        const checkboxes = document.querySelectorAll("input[type='checkbox']")
        expect(checkboxes.length).toBe(18)
        const ids = Array.from(checkboxes.values()).map(checkbox => checkbox.id)
        expect(ids).toEqual([
          'WHAT_ID_DOCUMENTS-BIRTH_CERTIFICATE',
          'WHAT_ID_DOCUMENTS-PASSPORT',
          'WHAT_ID_DOCUMENTS-DRIVING_LICENCE',
          'WHAT_ID_DOCUMENTS-MARRIAGE_CERTIFICATE',
          'WHAT_ID_DOCUMENTS-DIVORCE_CERTIFICATE',
          'WHAT_ID_DOCUMENTS-BIOMETRIC_RESIDENCE_PERMIT',
          'WHAT_ID_DOCUMENTS-DEED_POLL_CERTIFICATE',
          'WHAT_ID_DOCUMENTS-CITIZEN_CARD',
          'WHAT_ID_DOCUMENTS-NO_ID_DOCUMENTS',
          'WHAT_ID_DOCUMENTS-NO_ANSWER',
          'SELECT_BENEFITS-ESA',
          'SELECT_BENEFITS-HOUSING_BENEFIT',
          'SELECT_BENEFITS-UNIVERSAL_CREDIT_HOUSING_ELEMENT',
          'SELECT_BENEFITS-UNIVERSAL_CREDIT',
          'SELECT_BENEFITS-PIP',
          'SELECT_BENEFITS-STATE_PENSION',
          'SELECT_BENEFITS-NO_BENEFITS',
          'SELECT_BENEFITS-NO_ANSWER',
        ])
      })
  })

  it('optional text appears', async () => {
    const stateKey = {
      assessmentType: 'BCST2',
      prisonerNumber: '123',
      userId: 'user1',
      pathway: 'ACCOMMODATION',
    }

    const getWorkingAssessmentVersionSpy = jest
      .spyOn(assessmentStateService, 'getWorkingAssessmentVersion')
      .mockResolvedValue(3)

    const apiAssessmentPage = {
      id: 'MY_PAGE',
      title: 'My page',
      questionsAndAnswers: [
        {
          question: {
            id: 'QUESTION_1',
            title: 'Question 1',
            type: 'LONG_TEXT',
            validation: { type: 'OPTIONAL' },
          },
          originalPageId: 'MY_PAGE',
        },
        {
          question: {
            id: 'QUESTION_2',
            title: 'Question 2',
            type: 'LONG_TEXT',
            validation: { type: 'MANDATORY' },
          },
          originalPageId: 'MY_PAGE',
        },
        {
          question: {
            id: 'QUESTION_3',
            title: 'Question 3',
            type: 'SHORT_TEXT',
            validation: { type: 'MANDATORY' },
          },
          originalPageId: 'MY_PAGE',
        },
        {
          question: {
            id: 'QUESTION_4',
            title: 'Question 4',
            type: 'SHORT_TEXT',
            validation: { type: 'OPTIONAL' },
          },
          originalPageId: 'MY_PAGE',
        },
      ],
    } as ApiAssessmentPage
    const getAssessmentPageSpy = jest.spyOn(rpService, 'getAssessmentPage').mockResolvedValue(apiAssessmentPage)

    const checkForConvergenceSpy = jest.spyOn(assessmentStateService, 'checkForConvergence').mockResolvedValue(false)

    const updatePageLoadHistorySpy = jest.spyOn(assessmentStateService, 'updatePageLoadHistory').mockImplementation()

    const mergedQuestionsAndAnswers = [
      {
        question: 'QUESTION_1',
        questionTitle: 'Question 1',
        pageId: 'PAGE_1',
        questionType: 'LONG_TEXT',
        answer: {
          answer: 'Some long text here',
          displayText: 'Some long text here',
          '@class': 'StringAnswer',
        },
      },
      {
        question: 'QUESTION_2',
        questionTitle: 'Question 2',
        pageId: 'PAGE_1',
        questionType: 'LONG_TEXT',
        answer: {
          answer: 'Some long text here',
          displayText: 'Some long text here',
          '@class': 'StringAnswer',
        },
      },
      {
        question: 'QUESTION_3',
        questionTitle: 'Question 3',
        pageId: 'PAGE_1',
        questionType: 'SHORT_TEXT',
        answer: {
          answer: 'Some long text here',
          displayText: 'Some long text here',
          '@class': 'StringAnswer',
        },
      },
      {
        question: 'QUESTION_4',
        questionTitle: 'Question 4',
        pageId: 'PAGE_1',
        questionType: 'SHORT_TEXT',
        answer: {
          answer: 'Some long text here',
          displayText: 'Some long text here',
          '@class': 'StringAnswer',
        },
      },
    ] as CachedQuestionAndAnswer[]
    const getMergedQuestionsAndAnswersSpy = jest
      .spyOn(assessmentStateService, 'getMergedQuestionsAndAnswers')
      .mockResolvedValue(mergedQuestionsAndAnswers)

    await request(app)
      .get(
        `/ImmediateNeedsReport/pathway/${stateKey.pathway}/page/THE_PAGE?prisonerNumber=${stateKey.prisonerNumber}&pathway=${stateKey.pathway}&type=BCST2&version=3`,
      )
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())

    expect(getWorkingAssessmentVersionSpy).toHaveBeenCalledWith(stateKey)
    expect(getAssessmentPageSpy).toHaveBeenCalledWith(stateKey.prisonerNumber, stateKey.pathway, 'THE_PAGE', 'BCST2', 3)
    expect(checkForConvergenceSpy).toHaveBeenCalledWith(stateKey, {
      pageId: 'MY_PAGE',
      questions: ['QUESTION_1', 'QUESTION_2', 'QUESTION_3', 'QUESTION_4'],
    })
    expect(updatePageLoadHistorySpy).toHaveBeenCalledWith(stateKey, {
      pageId: 'MY_PAGE',
      questions: ['QUESTION_1', 'QUESTION_2', 'QUESTION_3', 'QUESTION_4'],
    })
    expect(getMergedQuestionsAndAnswersSpy).toHaveBeenCalledWith(stateKey, apiAssessmentPage.questionsAndAnswers)
  })
})

describe('startEdit', () => {
  it('should use version 1 when assessment is submitted and db has no version', async () => {
    const stateKey = {
      assessmentType: 'BCST2',
      prisonerNumber: '123',
      userId: 'user1',
      pathway: 'ACCOMMODATION',
    }

    const getLatestAssessmentSpy = jest.spyOn(rpService, 'getLatestAssessmentVersion').mockResolvedValue(null)

    const apiAssessmentPage = {
      id: 'MY_PAGE',
      title: 'My page',
      questionsAndAnswers: [
        {
          question: {
            id: 'QUESTION_1',
            title: 'Question 1',
            type: 'LONG_TEXT',
          },
          originalPageId: 'MY_PAGE',
        },
      ],
    } as ApiAssessmentPage
    const getAssessmentPageSpy = jest.spyOn(rpService, 'getAssessmentPage').mockResolvedValue(apiAssessmentPage)

    const initialiseCacheSpy = jest.spyOn(assessmentStateService, 'initialiseCache').mockImplementation()

    const startEditSpy = jest.spyOn(assessmentStateService, 'startEdit').mockImplementation()

    await request(app)
      .get(
        `/ImmediateNeedsReport/pathway/${stateKey.pathway}/page/MY_PAGE/start-edit?prisonerNumber=${stateKey.prisonerNumber}&type=${stateKey.assessmentType}&submitted=true`,
      )
      .expect(302)
      .expect(res => {
        expect(res.text).toContain(
          'Found. Redirecting to /ImmediateNeedsReport/pathway/ACCOMMODATION/page/MY_PAGE?prisonerNumber=123&edit=true&type=BCST2&submitted=true',
        )
      })

    expect(getLatestAssessmentSpy).toHaveBeenCalledWith(
      stateKey.prisonerNumber,
      stateKey.assessmentType,
      stateKey.pathway,
    )
    expect(getAssessmentPageSpy).toHaveBeenCalledWith(
      stateKey.prisonerNumber,
      stateKey.pathway,
      'CHECK_ANSWERS',
      'BCST2',
      1,
    )
    expect(initialiseCacheSpy).toHaveBeenCalledWith(stateKey, 1, apiAssessmentPage.questionsAndAnswers)
    expect(startEditSpy).toHaveBeenCalledWith(stateKey, 'MY_PAGE')
  })
  it('Happy path when assessment is not submitted', async () => {
    const stateKey = {
      assessmentType: 'BCST2',
      prisonerNumber: '123',
      userId: 'user1',
      pathway: 'ACCOMMODATION',
    }

    const startEditSpy = jest.spyOn(assessmentStateService, 'startEdit').mockImplementation()

    await request(app)
      .get(
        `/ImmediateNeedsReport/pathway/${stateKey.pathway}/page/MY_PAGE/start-edit?prisonerNumber=${stateKey.prisonerNumber}&type=BCST2`,
      )
      .expect(302)
      .expect(res => {
        expect(res.text).toContain(
          'Found. Redirecting to /ImmediateNeedsReport/pathway/ACCOMMODATION/page/MY_PAGE?prisonerNumber=123&edit=true&type=BCST2',
        )
      })

    expect(startEditSpy).toHaveBeenCalledWith(stateKey, 'MY_PAGE')
  })
})

describe('saveAnswerAndGetNextPage', () => {
  it('Uses default version 1 when there is no version in the cache', async () => {
    const apiAssessmentPage: ApiAssessmentPage = {
      id: 'PAGE_1',
      title: 'Page 1 title',
      questionsAndAnswers: [
        {
          question: {
            id: 'QUESTION_1',
            title: 'Question title',
            subTitle: 'Question subtitle',
            type: 'SHORT_TEXT',
          },
          answer: {
            answer: 'Answer text',
            '@class': 'StringAnswer',
          },
          originalPageId: 'PAGE_1',
        },
      ],
    }

    const workingAssessment: WorkingCachedAssessment = {
      assessment: {
        questionsAndAnswers: [
          {
            question: 'QUESTION_1',
            questionTitle: 'Question title',
            pageId: 'PAGE_1',
            questionType: 'SHORT_TEXT',
            answer: { answer: 'Answer text', '@class': 'StringAnswer', displayText: 'Answer text' },
          },
        ],
        version: null,
      },
      pageLoadHistory: [{ pageId: 'PAGE_1', questions: ['QUESTION_1'] }],
    }

    const getWorkingAssessmentVersionSpy = jest
      .spyOn(assessmentStateService, 'getWorkingAssessmentVersion')
      .mockResolvedValue(undefined)
    const getAssessmentPageSpy = jest.spyOn(rpService, 'getAssessmentPage').mockResolvedValue(apiAssessmentPage)

    const answerSpy = jest.spyOn(assessmentStateService, 'answer').mockImplementation()

    const getWorkingAssessmentSpy = jest
      .spyOn(assessmentStateService, 'getWorkingAssessment')
      .mockResolvedValue(workingAssessment)
    const fetchNextPageSpy = jest.spyOn(rpService, 'fetchNextPage').mockResolvedValue({ nextPageId: 'PAGE_ID' })

    await request(app)
      .post('/ImmediateNeedsReport-next-page?type=BCST2&pathway=ACCOMMODATION&prisonerNumber=123')
      .send({
        assessmentType: 'BCST2',
        pathway: 'ACCOMMODATION',
        currentPageId: 'PAGE_1',
        QUESTION_1: 'Answer text',
      })
      .expect(302)
      .expect(res => {
        expect(res.text).toContain(
          'Found. Redirecting to /ImmediateNeedsReport/pathway/ACCOMMODATION/page/PAGE_ID?prisonerNumber=123&backButton=false&type=BCST2',
        )
      })

    const stateKey = {
      assessmentType: 'BCST2',
      prisonerNumber: '123',
      userId: 'user1',
      pathway: 'ACCOMMODATION',
    }

    expect(getWorkingAssessmentVersionSpy).toHaveBeenCalledWith(stateKey)
    expect(getAssessmentPageSpy).toHaveBeenCalledWith('123', 'ACCOMMODATION', 'PAGE_1', 'BCST2', 1)
    expect(answerSpy).toHaveBeenCalledWith(stateKey, workingAssessment.assessment, apiAssessmentPage)
    expect(getWorkingAssessmentSpy).toHaveBeenCalledWith(stateKey)
    expect(fetchNextPageSpy).toHaveBeenCalledWith(
      stateKey.prisonerNumber,
      stateKey.pathway,
      workingAssessment.assessment,
      'PAGE_1',
      'BCST2',
      1,
    )
  })
  it('Validation errors', async () => {
    const apiAssessmentPage: ApiAssessmentPage = {
      id: 'PAGE_1',
      title: 'Page 1 title',
      questionsAndAnswers: [
        {
          question: {
            id: 'QUESTION_1',
            title: 'Question title',
            subTitle: 'Question subtitle',
            type: 'SHORT_TEXT',
            validation: { type: 'MANDATORY' },
          },
          answer: null,
          originalPageId: 'PAGE_1',
        },
        {
          question: {
            id: 'QUESTION_2',
            title: 'Another question title',
            subTitle: 'Another question subtitle',
            type: 'SHORT_TEXT',
            validation: { type: 'MANDATORY' },
          },
          answer: null,
          originalPageId: 'PAGE_1',
        },
      ],
    }

    const expectedDataToSubmit: CachedAssessment = {
      questionsAndAnswers: [
        {
          question: 'QUESTION_1',
          questionTitle: 'Question title',
          pageId: 'PAGE_1',
          questionType: 'SHORT_TEXT',
          answer: { answer: 'Answer text', '@class': 'StringAnswer', displayText: 'Answer text' },
        },
        {
          question: 'QUESTION_2',
          questionTitle: 'Another question title',
          pageId: 'PAGE_1',
          questionType: 'SHORT_TEXT',
          answer: { answer: undefined, '@class': 'StringAnswer', displayText: undefined },
        },
      ],
      version: null,
    }

    const getWorkingAssessmentVersionSpy = jest
      .spyOn(assessmentStateService, 'getWorkingAssessmentVersion')
      .mockResolvedValue(2)
    const getAssessmentPageSpy = jest.spyOn(rpService, 'getAssessmentPage').mockResolvedValue(apiAssessmentPage)

    const answerSpy = jest.spyOn(assessmentStateService, 'answer').mockImplementation()

    await request(app)
      .post('/ImmediateNeedsReport-next-page?type=BCST2&pathway=ACCOMMODATION&prisonerNumber=123')
      .send({
        assessmentType: 'BCST2',
        pathway: 'ACCOMMODATION',
        currentPageId: 'PAGE_1',
        QUESTION_1: 'Answer text',
      })
      .expect(302)
      .expect(res => {
        expect(res.text).toContain(
          'Found. Redirecting to /ImmediateNeedsReport/pathway/ACCOMMODATION/page/PAGE_1?prisonerNumber=123&validationErrors=%5B%7B%22validationType%22%3A%22MANDATORY_INPUT%22%2C%22questionId%22%3A%22QUESTION_2%22%7D%5D&backButton=false&type=BCST2',
        )
      })

    const stateKey = {
      assessmentType: 'BCST2',
      prisonerNumber: '123',
      userId: 'user1',
      pathway: 'ACCOMMODATION',
    }

    expect(getWorkingAssessmentVersionSpy).toHaveBeenCalledWith(stateKey)
    expect(getAssessmentPageSpy).toHaveBeenCalledWith('123', 'ACCOMMODATION', 'PAGE_1', 'BCST2', 2)
    expect(answerSpy).toHaveBeenCalledWith(stateKey, expectedDataToSubmit, apiAssessmentPage)
    expect(jest.spyOn(assessmentStateService, 'getWorkingAssessment')).toHaveBeenCalledTimes(0)
    expect(jest.spyOn(rpService, 'fetchNextPage')).toHaveBeenCalledTimes(0)
  })

  it('Validation summary errors', async () => {
    const apiAssessmentPage: ApiAssessmentPage = {
      id: 'PAGE_1',
      title: 'Page 1 title',
      questionsAndAnswers: [
        {
          question: {
            id: 'QUESTION_1',
            title: 'Question title',
            subTitle: 'Question subtitle',
            type: 'SHORT_TEXT',
            validation: { type: 'MANDATORY' },
          },
          answer: null,
          originalPageId: 'PAGE_1',
        },
        {
          question: {
            id: 'QUESTION_2',
            title: 'Another question title',
            subTitle: 'Another question subtitle',
            type: 'SHORT_TEXT',
            validation: { type: 'MANDATORY' },
          },

          answer: null,
          originalPageId: 'PAGE_1',
        },
        {
          question: {
            id: 'QUESTION_3',
            title: 'Another question title',
            subTitle: 'Another question subtitle',
            type: 'LONG_TEXT',
            validation: { type: 'MANDATORY' },
          },

          answer: null,
          originalPageId: 'PAGE_1',
        },
        {
          question: {
            id: 'QUESTION_4',
            title: 'Another question title',
            subTitle: 'Another question subtitle',
            type: 'LONG_TEXT',
            validation: { type: 'MANDATORY' },
          },

          answer: null,
          originalPageId: 'PAGE_1',
        },
      ],
    }

    const getWorkingAssessmentVersionSpy = jest
      .spyOn(assessmentStateService, 'getWorkingAssessmentVersion')
      .mockResolvedValue(2)
    const getAssessmentPageSpy = jest.spyOn(rpService, 'getAssessmentPage').mockResolvedValue(apiAssessmentPage)

    const checkForConvergenceSpy = jest.spyOn(assessmentStateService, 'checkForConvergence').mockResolvedValue(false)

    const updatePageLoadHistorySpy = jest.spyOn(assessmentStateService, 'updatePageLoadHistory').mockImplementation()

    const mergedQuestionsAndAnswers = [
      {
        question: 'QUESTION_1',
        questionTitle: 'Question 1',
        pageId: 'PAGE_1',
        questionType: 'SHORT_TEXT',
        answer: {
          answer: 'Some short text here',
          displayText: 'Some short text here',
          '@class': 'StringAnswer',
        },
      },
    ] as CachedQuestionAndAnswer[]
    const getMergedQuestionsAndAnswersSpy = jest
      .spyOn(assessmentStateService, 'getMergedQuestionsAndAnswers')
      .mockResolvedValue(mergedQuestionsAndAnswers)

    await request(app)
      .get(
        '/ImmediateNeedsReport/pathway/ACCOMMODATION/page/PAGE_1?prisonerNumber=123&validationErrors=%5B%7B%22validationType%22%3A%22MANDATORY_INPUT%22%2C%22questionId%22%3A%22QUESTION_1%22%7D%2C%7B%22validationType%22%3A%22MAX_CHARACTER_LIMIT_SHORT_TEXT%22%2C%22questionId%22%3A%22QUESTION_2%22%7D%2C%7B%22validationType%22%3A%22MAX_CHARACTER_LIMIT_LONG_TEXT%22%2C%22questionId%22%3A%22QUESTION_3%22%7D%2C%7B%22validationType%22%3A%22MAX_CHARACTER_LIMIT_ADDRESS%22%2C%22questionId%22%3A%22QUESTION_4%22%7D%5D&backButton=false&type=BCST2',
      )
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('<ul class="govuk-list govuk-error-summary__list">')
      })
      .expect(res => expect(res.text).toMatchSnapshot())

    const stateKey = {
      assessmentType: 'BCST2',
      prisonerNumber: '123',
      userId: 'user1',
      pathway: 'ACCOMMODATION',
    }

    expect(getWorkingAssessmentVersionSpy).toHaveBeenCalledWith(stateKey)
    expect(getAssessmentPageSpy).toHaveBeenCalledWith('123', 'ACCOMMODATION', 'PAGE_1', 'BCST2', 2)
    expect(checkForConvergenceSpy).toHaveBeenCalledWith(stateKey, {
      pageId: 'PAGE_1',
      questions: ['QUESTION_1', 'QUESTION_2', 'QUESTION_3', 'QUESTION_4'],
    })
    expect(updatePageLoadHistorySpy).toHaveBeenCalledWith(stateKey, {
      pageId: 'PAGE_1',
      questions: ['QUESTION_1', 'QUESTION_2', 'QUESTION_3', 'QUESTION_4'],
    })
    expect(getMergedQuestionsAndAnswersSpy).toHaveBeenCalledWith(stateKey, apiAssessmentPage.questionsAndAnswers)
  })
})

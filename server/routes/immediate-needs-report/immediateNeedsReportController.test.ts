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
        `/ImmediateNeedsReport/pathway/${stateKey.pathway}/page/THE_PAGE?prisonerNumber=${stateKey.prisonerNumber}&pathway=${stateKey.pathway}&assessmentType=BCST2`,
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
        `/ImmediateNeedsReport/pathway/${stateKey.pathway}/page/MY_PAGE/start-edit?prisonerNumber=${stateKey.prisonerNumber}&assessmentType=${stateKey.assessmentType}&submitted=true`,
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
        `/ImmediateNeedsReport/pathway/${stateKey.pathway}/page/MY_PAGE/start-edit?prisonerNumber=${stateKey.prisonerNumber}&assessmentType=BCST2`,
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
            validationType: 'MANDATORY',
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
            validationType: 'MANDATORY',
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
})

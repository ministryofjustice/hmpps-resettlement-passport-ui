import type { Express } from 'express'
import request from 'supertest'
import { PersonalDetails, PrisonerData } from '../../@types/express/index.d'
import { appWithAllRoutes } from '../testutils/appSetup'

import RpService from '../../services/rpService'
import { AssessmentStateService } from '../../data/assessmentStateService'
import { AssessmentPage, SubmittedInput, SubmittedQuestionAndAnswer } from '../../data/model/immediateNeedsReport'
import Config from '../../s3Config'
import { configHelper } from '../configHelperTest'

let app: Express
let rpService: jest.Mocked<RpService>
let assessmentStateService: jest.Mocked<AssessmentStateService>
const config: jest.Mocked<Config> = new Config() as jest.Mocked<Config>

beforeEach(() => {
  rpService = new RpService() as jest.Mocked<RpService>
  assessmentStateService = new AssessmentStateService(null) as jest.Mocked<AssessmentStateService>
  configHelper(config)

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

function stubPrisonerDetails() {
  jest.spyOn(rpService, 'getPrisonerDetails').mockResolvedValue({
    personalDetails: {
      prisonerNumber: '123',
      facialImageId: '456',
    } as unknown as PersonalDetails,
  } as unknown as PrisonerData)
}

describe('completeAssessment', () => {
  it('should submit the assessment to the backend then redirect to the task list', async () => {
    stubPrisonerDetails()

    const submission: SubmittedInput = {
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
    }
    jest.spyOn(assessmentStateService, 'getExistingAssessmentAnsweredQuestions').mockResolvedValue(submission)

    const completeAssessmentSpy = jest.spyOn(rpService, 'completeAssessment').mockResolvedValue({})
    jest.spyOn(assessmentStateService, 'onComplete').mockImplementation()

    await request(app)
      .post('/ImmediateNeedsReport/pathway/DRUGS_AND_ALCOHOL/complete?prisonerNumber=123')
      .expect(302)
      .expect(res => {
        expect(res.text).toContain('Found. Redirecting to /assessment-task-list?prisonerNumber=123&type=BCST2')
      })

    expect(completeAssessmentSpy).toHaveBeenCalledWith('123', 'DRUGS_AND_ALCOHOL', submission, 'BCST2')
  })

  it('it should not submit the assessment if there is no submitted input', async () => {
    stubPrisonerDetails()

    jest
      .spyOn(assessmentStateService, 'getExistingAssessmentAnsweredQuestions')
      .mockResolvedValue({ questionsAndAnswers: [], version: null })

    const completeAssessmentSpy = jest.spyOn(rpService, 'completeAssessment').mockResolvedValue({})

    await request(app)
      .post('/ImmediateNeedsReport/pathway/DRUGS_AND_ALCOHOL/complete?prisonerNumber=123')
      .expect(302)
      .expect(res => {
        expect(res.text).toContain('Found. Redirecting to /assessment-task-list?prisonerNumber=123&type=BCST2')
      })

    expect(completeAssessmentSpy).toHaveBeenCalledTimes(0)
  })
})

describe('getFirstPage', () => {
  it('Uses default version 1 when there is no version in the cache', async () => {
    stubPrisonerDetails()

    const submission: SubmittedInput = {
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
    }

    const getLatestAssessmentVersionSpy = jest.spyOn(rpService, 'getLatestAssessmentVersion').mockResolvedValue(2)
    const initialiseCacheSpy = jest.spyOn(assessmentStateService, 'initialiseCache').mockResolvedValue(submission)
    const fetchNextPageSpy = jest.spyOn(rpService, 'fetchNextPage').mockResolvedValue({ nextPageId: 'PAGE_ID' })

    await request(app)
      .get('/ImmediateNeedsReport-next-page?type=BCST2&pathway=ACCOMMODATION&prisonerNumber=123')
      .expect(302)
      .expect(res => {
        expect(res.text).toContain(
          'Found. Redirecting to /ImmediateNeedsReport/pathway/ACCOMMODATION/page/PAGE_ID?prisonerNumber=123&type=BCST2',
        )
      })

    expect(getLatestAssessmentVersionSpy).toHaveBeenCalledWith('123', 'BCST2', 'ACCOMMODATION')
    expect(initialiseCacheSpy).toHaveBeenCalledWith(
      {
        prisonerNumber: '123',
        userId: 'user1',
        pathway: 'ACCOMMODATION',
      },
      2,
    )
    expect(fetchNextPageSpy).toHaveBeenCalledWith('123', 'ACCOMMODATION', submission, 'page1', 'BCST2', 1)
  })
})

describe('getView', () => {
  it('should use version 1 when existing assessment in cache has no version', async () => {
    stubPrisonerDetails()

    const stateKey = {
      prisonerNumber: '123',
      userId: 'user1',
      pathway: 'ACCOMMODATION',
    }

    const deleteEditedQuestionListSpy = jest
      .spyOn(assessmentStateService, 'deleteEditedQuestionList')
      .mockImplementation()

    const submission: SubmittedInput = {
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
    }
    const getAssessmentSpy = jest.spyOn(assessmentStateService, 'getAssessment').mockResolvedValue(submission)

    const assessmentPage = {
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
    } as AssessmentPage
    const getAssessmentPageSpy = jest.spyOn(rpService, 'getAssessmentPage').mockResolvedValue(assessmentPage)

    const setCurrentPageSpy = jest.spyOn(assessmentStateService, 'setCurrentPage').mockImplementation()
    const checkForConvergenceSpy = jest.spyOn(assessmentStateService, 'checkForConvergence').mockImplementation()

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
    ] as SubmittedQuestionAndAnswer[]
    const mergeQuestionsAndAnswersSpy = jest
      .spyOn(assessmentStateService, 'mergeQuestionsAndAnswers')
      .mockReturnValue(mergedQuestionsAndAnswers)

    await request(app)
      .get(
        `/ImmediateNeedsReport/pathway/${stateKey.pathway}/page/THE_PAGE?prisonerNumber=${stateKey.prisonerNumber}&pathway=${stateKey.pathway}&assessmentType=BCST2`,
      )
      .expect(200)

    expect(deleteEditedQuestionListSpy).toHaveBeenCalledWith(stateKey)

    expect(getAssessmentSpy).toHaveBeenCalledWith(stateKey)
    expect(getAssessmentPageSpy).toHaveBeenCalledWith(stateKey.prisonerNumber, stateKey.pathway, 'THE_PAGE', 'BCST2', 1)
    expect(setCurrentPageSpy).toHaveBeenCalledWith(stateKey, assessmentPage)
    expect(checkForConvergenceSpy).toHaveBeenCalledWith(stateKey, assessmentPage, false)
    expect(mergeQuestionsAndAnswersSpy).toHaveBeenCalledWith(assessmentPage, submission)
  })
})

describe('startEdit', () => {
  it('should use version 1 when assessment is submitted and db has no version', async () => {
    stubPrisonerDetails()

    const stateKey = {
      prisonerNumber: '123',
      userId: 'user1',
      pathway: 'ACCOMMODATION',
    }

    const getLatestAssessmentSpy = jest.spyOn(rpService, 'getLatestAssessmentVersion').mockResolvedValue(null)

    const assessmentPage = {
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
    } as AssessmentPage
    const getAssessmentPageSpy = jest.spyOn(rpService, 'getAssessmentPage').mockResolvedValue(assessmentPage)

    const startEditSpy = jest.spyOn(assessmentStateService, 'startEdit').mockImplementation()

    await request(app)
      .get(
        `/ImmediateNeedsReport/pathway/${stateKey.pathway}/page/MY_PAGE/start-edit?prisonerNumber=${stateKey.prisonerNumber}&assessmentType=BCST2&submitted=true`,
      )
      .expect(302)
      .expect(res => {
        expect(res.text).toContain(
          'Found. Redirecting to /ImmediateNeedsReport/pathway/ACCOMMODATION/page/MY_PAGE?prisonerNumber=123&edit=true&type=BCST2&submitted=true',
        )
      })

    expect(getLatestAssessmentSpy).toHaveBeenCalledWith(stateKey.prisonerNumber, 'BCST2', stateKey.pathway)
    expect(getAssessmentPageSpy).toHaveBeenCalledWith(
      stateKey.prisonerNumber,
      stateKey.pathway,
      'CHECK_ANSWERS',
      'BCST2',
      1,
    )
    expect(startEditSpy).toHaveBeenCalledWith(stateKey, assessmentPage, 1)
  })
  it('should use version 1 when existing assessment in cache has no version and assessment is not submitted', async () => {
    stubPrisonerDetails()

    const stateKey = {
      prisonerNumber: '123',
      userId: 'user1',
      pathway: 'ACCOMMODATION',
    }

    const submission: SubmittedInput = {
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
    }
    const getAssessmentSpy = jest.spyOn(assessmentStateService, 'getAssessment').mockResolvedValue(submission)

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

    expect(getAssessmentSpy).toHaveBeenCalledWith(stateKey)
    expect(startEditSpy).toHaveBeenCalledWith(stateKey, undefined, 1)
  })
})

describe('saveAnswerAndGetNextPage', () => {
  it('Uses default version 1 when there is no version in the cache', async () => {
    stubPrisonerDetails()

    const assessmentPage: AssessmentPage = {
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

    const submission: SubmittedInput = {
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
    }

    const getCurrentPageSpy = jest.spyOn(assessmentStateService, 'getCurrentPage').mockResolvedValue(assessmentPage)
    const getAssessmentSpy = jest.spyOn(assessmentStateService, 'getAssessment').mockResolvedValue(submission)
    const fetchNextPageSpy = jest.spyOn(rpService, 'fetchNextPage').mockResolvedValue({ nextPageId: 'PAGE_ID' })
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
          'Found. Redirecting to /ImmediateNeedsReport/pathway/ACCOMMODATION/page/PAGE_ID?prisonerNumber=123&backButton=false&type=BCST2',
        )
      })

    const stateKey = {
      prisonerNumber: '123',
      userId: 'user1',
      pathway: 'ACCOMMODATION',
    }

    expect(getCurrentPageSpy).toHaveBeenCalledWith(stateKey)

    expect(getAssessmentSpy).toHaveBeenCalledWith(stateKey)

    expect(fetchNextPageSpy).toHaveBeenCalledWith(
      stateKey.prisonerNumber,
      stateKey.pathway,
      submission,
      'PAGE_1',
      'BCST2',
      1,
    )
    expect(answerSpy).toHaveBeenCalledWith(stateKey, submission, false)
  })
})

import QuestionAndAnswerService from './questionAndAnswerService'
import RpService from './rpService'
import AssessmentStore from '../data/assessmentStore'
import { QuestionsAndAnswers } from '../data/model/BCST2Form'
import { createRedisClient } from '../data/redisClient'
import { RPClient } from '../data'
import GetAssessmentRequest from '../data/model/getAssessmentRequest'

jest.mock('../../logger')
jest.mock('../data')

describe('QuestionAndAnswerService', () => {
  let mockRpClient: jest.Mocked<RPClient>
  let rpService: RpService
  let qAndAService: QuestionAndAnswerService
  let store: jest.Mocked<AssessmentStore>

  beforeEach(() => {
    store = new AssessmentStore(createRedisClient()) as jest.Mocked<AssessmentStore>
    mockRpClient = new RPClient() as jest.Mocked<RPClient>
    rpService = new RpService(mockRpClient)
    qAndAService = new QuestionAndAnswerService(rpService, store)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should follow isSubmittedPath if the assessment is submitted', async () => {
    const getAssessmentRequest = new GetAssessmentRequest('{"test":["validationTestString"]}')
    getAssessmentRequest.assessmentType = 'BCST2'

    store.deleteEditedQuestionList = jest.fn()
    const deleteEditedQuestionListSpy = jest.spyOn(store, 'deleteEditedQuestionList')

    store.setAssessment = jest.fn()
    const setAssessmentSpy = jest.spyOn(store, 'setAssessment')

    const getAssessmentPageSpy = jest.spyOn(rpService, 'getAssessmentPage')

    const questionAndAnswers = getTestQAndAs()

    const assessmentPage = {
      error: null as string,
      id: 'pageId',
      questionsAndAnswers: questionAndAnswers,
    }

    mockRpClient.get.mockResolvedValue(assessmentPage)

    getAssessmentRequest.editMode = true
    getAssessmentRequest.submitted = true

    await qAndAService.getAssessmentPage(getAssessmentRequest)

    expect(deleteEditedQuestionListSpy).toHaveBeenCalledTimes(1)
    expect(setAssessmentSpy).toHaveBeenCalledTimes(1)
    expect(getAssessmentPageSpy).toHaveBeenCalledTimes(2)
  })

  it('should call noExistingAssessmentPath if no existing assessment', async () => {
    const getAssessmentReq = new GetAssessmentRequest('{"test":["validationTestString"]}')
    getAssessmentReq.assessmentType = 'BCST2'
    getAssessmentReq.pathway = 'Pathway'
    getAssessmentReq.prisonerNumber = 'ThePrisoner:Number6'

    getAssessmentReq.editMode = true
    getAssessmentReq.submitted = false

    store.getAssessment = jest.fn().mockResolvedValue(null)

    const questionAndAnswers = getTestQAndAs()

    rpService.getAssessmentPage = jest
      .fn()
      .mockResolvedValue({ error: null, id: 'CHECK_ANSWERS', questionsAndAnswers: questionAndAnswers })

    const expected = `/BCST2-next-page?prisonerNumber=${getAssessmentReq.prisonerNumber}&pathway=${
      getAssessmentReq.pathway
    }&type=${getAssessmentReq.assessmentType.toString()}`

    const res = await qAndAService.getAssessmentPage(getAssessmentReq)

    expect(res.redirect).toBe(expected)
  })

  it('should call editedQuestionsPath if edited questions and no validation errors', async () => {
    const getAssessmentReq = new GetAssessmentRequest('{"test":["validationTestString"]}')
    getAssessmentReq.assessmentType = 'BCST2'
    getAssessmentReq.pathway = 'Pathway'
    getAssessmentReq.prisonerNumber = 'ThePrisoner:Number6'

    getAssessmentReq.editMode = true
    getAssessmentReq.submitted = false

    store.getEditedQuestionList = jest.fn().mockResolvedValue('[]')
    store.getAssessment = jest.fn().mockResolvedValue('{ "questionsAndAnswers": [{ "question": { "id": "hello" }}]}')
    store.setCurrentPage = jest.fn().mockResolvedValue('editedQList')
    rpService.getAssessmentPage = jest.fn().mockResolvedValue({ error: null, id: 'CHECK_ANSWERS' })

    const resp = await qAndAService.getAssessmentPage(getAssessmentReq)

    const expected = `/BCST2/pathway/${getAssessmentReq.pathway}/page/CHECK_ANSWERS?prisonerNumber=${getAssessmentReq.prisonerNumber}&edit=true&type=${getAssessmentReq.assessmentType}`

    expect(resp.redirect).toBe(expected)
  })
})

function getTestQAndAs(): QuestionsAndAnswers[] {
  const testQuestionsAndAnswersItem: QuestionsAndAnswers = {
    question: {
      id: 'questionId',
      title: 'questionTitle',
      type: 'questionType',
    },
    answer: {
      answer: 'answerText',
      '@class': 'StringAnswer',
    },
    originalPageId: 'originalPageId',
  }

  return [testQuestionsAndAnswersItem]
}

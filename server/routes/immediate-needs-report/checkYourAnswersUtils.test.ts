import { CachedQuestionAndAnswer } from '../../data/model/immediateNeedsReport'
import { categoriseForCheckYourAnswers } from './checkYourAnswersUtils'
import accommodationV3Answers from './accommodation-answers-v3.json'
import accommodationV1Answers from './accommodation-answers-v1.json'

describe('categoriseForCheckYourAnswers', () => {
  it('Should populate support needs and details for v3', () => {
    const mergedQuestionsAndAnswers = accommodationV3Answers as CachedQuestionAndAnswer[]
    const { restQuestions, supportNeeds, supportNeedsDetails, status, caseNote } =
      categoriseForCheckYourAnswers(mergedQuestionsAndAnswers)

    expect(questionIdsOf(restQuestions)).toEqual([
      'WHERE_DID_THEY_LIVE',
      'WHERE_DID_THEY_LIVE_ADDITIONAL_DETAILS',
      'WHERE_WILL_THEY_LIVE',
      'WHERE_WILL_THEY_LIVE_ADDITIONAL_DETAILS',
    ])
    expect(supportNeeds?.answer?.answer).toEqual(['HELP_TO_FIND_ACCOMMODATION', 'HELP_TO_KEEP_HOME'])
    expect(supportNeedsDetails?.answer?.answer).toEqual('FRANK BUTCHER')
    expect(status?.answer.answer).toEqual('SUPPORT_REQUIRED')
    expect(caseNote).toBeNull()
  })

  it('Should populate case note for v1', () => {
    const mergedQuestionsAndAnswers = accommodationV1Answers as CachedQuestionAndAnswer[]
    const { restQuestions, supportNeeds, supportNeedsDetails, status, caseNote } =
      categoriseForCheckYourAnswers(mergedQuestionsAndAnswers)

    expect(questionIdsOf(restQuestions)).toEqual([
      'WHERE_DID_THEY_LIVE',
      'WHERE_DID_THEY_LIVE_ADDRESS',
      'HELP_TO_KEEP_HOME',
      'WHERE_WILL_THEY_LIVE_1',
    ])
    expect(supportNeeds).toBeNull()
    expect(supportNeedsDetails).toBeNull()
    expect(status?.answer.answer).toEqual('SUPPORT_NOT_REQUIRED')
    expect(caseNote?.answer.answer).toEqual('Monkey!')
  })
})

function questionIdsOf(questionAndAnswers: CachedQuestionAndAnswer[]): string[] {
  return questionAndAnswers.map(qAndA => qAndA.question)
}

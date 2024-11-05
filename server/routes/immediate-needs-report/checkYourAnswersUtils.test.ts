import { CachedQuestionAndAnswer } from '../../data/model/immediateNeedsReport'
import { categoriseForCheckYourAnswers } from './checkYourAnswersUtils'

describe('categoriseForCheckYourAnswers', () => {
  it('Should populate support needs and details for v3', () => {
    const mergedQuestionsAndAnswers: CachedQuestionAndAnswer[] = [
      {
        question: 'WHERE_DID_THEY_LIVE',
        questionTitle: 'Where did the person in prison live before custody?',
        questionType: 'RADIO',
        pageId: 'ACCOMMODATION_REPORT',
        answer: {
          answer: 'NO_PERMANENT_OR_FIXED',
          displayText: 'No permanent or fixed address',
          '@class': 'StringAnswer',
        },
      },
      {
        question: 'WHERE_DID_THEY_LIVE_ADDITIONAL_DETAILS',
        questionTitle: 'Additional details',
        questionType: 'LONG_TEXT',
        pageId: 'ACCOMMODATION_REPORT',
        answer: { answer: '', displayText: '', '@class': 'StringAnswer' },
      },
      {
        question: 'WHERE_WILL_THEY_LIVE',
        questionTitle: 'Where will the person in prison live when they are released?',
        questionType: 'RADIO',
        pageId: 'ACCOMMODATION_REPORT',
        answer: {
          answer: 'DOES_NOT_HAVE_ANYWHERE',
          displayText: 'Does not have anywhere to live',
          '@class': 'StringAnswer',
        },
      },
      {
        question: 'WHERE_WILL_THEY_LIVE_ADDITIONAL_DETAILS',
        questionTitle: 'Additional details',
        questionType: 'LONG_TEXT',
        pageId: 'ACCOMMODATION_REPORT',
        answer: { answer: 'Monkey', displayText: 'Monkey', '@class': 'StringAnswer' },
      },
      {
        question: 'SUPPORT_REQUIREMENTS',
        questionTitle: 'Support needs',
        questionType: 'CHECKBOX',
        pageId: 'SUPPORT_REQUIREMENTS',
        answer: {
          answer: ['HELP_TO_FIND_ACCOMMODATION', 'HELP_TO_KEEP_HOME'],
          displayText: ['Help to find accommodation', 'Help to keep their home while in prison'],
          '@class': 'ListAnswer',
        },
      },
      {
        question: 'SUPPORT_REQUIREMENTS_ADDITIONAL_DETAILS',
        questionTitle: 'Additional details',
        questionType: 'LONG_TEXT',
        pageId: 'SUPPORT_REQUIREMENTS',
        answer: { answer: 'FRANK BUTCHER', displayText: 'FRANK BUTCHER', '@class': 'StringAnswer' },
      },
      {
        question: 'SUPPORT_NEEDS',
        questionTitle: 'Accommodation resettlement status',
        questionType: 'RADIO',
        pageId: 'ASSESSMENT_SUMMARY',
        answer: { answer: 'SUPPORT_REQUIRED', displayText: 'Support required', '@class': 'StringAnswer' },
      },
    ]

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
})

function questionIdsOf(questionAndAnswers: CachedQuestionAndAnswer[]): string[] {
  return questionAndAnswers.map(qAndA => qAndA.question)
}

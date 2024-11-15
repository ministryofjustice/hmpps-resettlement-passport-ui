import { CachedQuestionAndAnswer } from '../../data/model/immediateNeedsReport'

type CheckYourAnswersQuestions = {
  restQuestions: CachedQuestionAndAnswer[]
  supportNeeds?: CachedQuestionAndAnswer
  supportNeedsDetails?: CachedQuestionAndAnswer
  status?: CachedQuestionAndAnswer
  caseNote?: CachedQuestionAndAnswer
}

export function categoriseForCheckYourAnswers(
  mergedQuestionsAndAnswers: CachedQuestionAndAnswer[],
): CheckYourAnswersQuestions {
  const restQuestions: CachedQuestionAndAnswer[] = []
  let supportNeeds: CachedQuestionAndAnswer = null
  let supportNeedsDetails: CachedQuestionAndAnswer = null
  let status: CachedQuestionAndAnswer = null
  let caseNote: CachedQuestionAndAnswer = null

  for (const questionAndAnswer of mergedQuestionsAndAnswers) {
    const { question } = questionAndAnswer
    if (question === 'SUPPORT_NEEDS' || question === 'SUPPORT_NEEDS_PRERELEASE') {
      status = questionAndAnswer
    } else if (question === 'CASE_NOTE_SUMMARY') {
      caseNote = questionAndAnswer
    } else if (question === 'SUPPORT_REQUIREMENTS') {
      supportNeeds = questionAndAnswer
    } else if (question === 'SUPPORT_REQUIREMENTS_ADDITIONAL_DETAILS') {
      supportNeedsDetails = questionAndAnswer
    } else {
      restQuestions.push(questionAndAnswer)
    }
  }

  return {
    restQuestions,
    supportNeeds,
    supportNeedsDetails,
    status,
    caseNote,
  }
}

export function isAdditionalDetails(questionAnswer: CachedQuestionAndAnswer): boolean {
  return questionAnswer?.question?.endsWith('_ADDITIONAL_DETAILS') ?? false
}

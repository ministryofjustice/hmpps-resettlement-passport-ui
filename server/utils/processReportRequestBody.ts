import { AssessmentPage, QuestionsAndAnswers } from '../data/model/immediateNeedsReport'
import { RequestBody, ResettlementReportUserInput } from './assessmentHelperTypes'

export const processReportRequestBody = (
  currentPage: AssessmentPage,
  body: RequestBody,
): ResettlementReportUserInput => {
  const questionsAndAnswers = Object.entries(body).map(([key, value]) => {
    const splitKey = key.split('-')

    // If a checkbox question has a freeText option, replace the default checkbox value with the freeText input value
    let answer: string | string[] = value
    const freeTextId = 'OTHER_SUPPORT_NEEDS'
    const freeTextValue = body.freeText ? `${freeTextId}: ${body.freeText}` : ''
    if (typeof value === 'string' && value.includes(freeTextId)) {
      // Replace in string
      answer = value.replace(freeTextId, freeTextValue)
    } else if (Array.isArray(value)) {
      // Replace in array if any element includes 'OTHER_SUPPORT_NEEDS'
      answer = value.map(item =>
        typeof item === 'string' && item.includes(freeTextId) ? item.replace(freeTextId, freeTextValue) : item,
      )
    }

    return { questionId: splitKey[0], subField: splitKey[1], answer }
  })

  // Go through all the questions and find any nested. If the parent question isn't answered, remove this nested question as the user never answered it
  const nestedQuestionsAnswered: QuestionsAndAnswers[] = []
  const allQuestionsInOrder: QuestionsAndAnswers[] = []
  currentPage.questionsAndAnswers.forEach(parentQuestion => {
    allQuestionsInOrder.push(parentQuestion)
    // Get the answer to each parent question
    const answerToParentQuestion = questionsAndAnswers.find(it => it.questionId === parentQuestion.question.id)?.answer

    // Find the associated nested question ids
    const associatedNestedQuestions = parentQuestion.question.options?.find(
      it => it.id === answerToParentQuestion,
    )?.nestedQuestions
    if (associatedNestedQuestions) {
      nestedQuestionsAnswered.push(...associatedNestedQuestions)
      allQuestionsInOrder.push(...associatedNestedQuestions)
    }
  })

  // Remove any questionAndAnswers which are neither parent nor answered nested questions
  const filteredAnsweredQuestions = questionsAndAnswers.filter(
    answeredQuestion =>
      nestedQuestionsAnswered.map(it => it.question.id).includes(answeredQuestion.questionId) ||
      currentPage.questionsAndAnswers.map(it => it.question.id).includes(answeredQuestion.questionId),
  )

  return {
    questionsAndAnswers: filteredAnsweredQuestions,
    flattenedQuestionsOnPage: allQuestionsInOrder,
    pageId: currentPage.id,
  }
}

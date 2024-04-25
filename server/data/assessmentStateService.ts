import AssessmentStore from './assessmentStore'
import { createRedisClient } from './redisClient'
import { AssessmentPage, SubmittedInput, SubmittedQuestionAndAnswer } from './model/BCST2Form'
import { getDisplayTextFromQandA } from '../utils/formatAssessmentResponse'

interface Request {
  prisonerData: {
    personalDetails: {
      prisonerNumber?: string
    }
  }
  session: {
    id: string
  }
}

export function createAssessmentStateService() {
  return new AssessmentStateService(new AssessmentStore(createRedisClient()))
}

export class AssessmentStateService {
  constructor(private readonly store: AssessmentStore) {
    // no-op
  }

  async reset(req: Request, pathway: string) {
    const { prisonerData } = req
    await this.store.deleteAssessment(req.session.id, prisonerData.personalDetails.prisonerNumber, pathway)
    await this.store.deleteEditedQuestionList(req.session.id, prisonerData.personalDetails.prisonerNumber, pathway)
    await this.store.setAssessment(req.session.id, prisonerData.personalDetails.prisonerNumber, pathway, {
      questionsAndAnswers: [],
    })
  }

  async answer(req: Request, pathway: string, answer: SubmittedInput) {
    const { prisonerNumber } = req.prisonerData.personalDetails
    // get previous Q&A's
    const allQuestionsAndAnswers = await this.store.getAssessment(req.session.id, prisonerNumber, pathway)

    answer.questionsAndAnswers.forEach((newQandA: SubmittedQuestionAndAnswer) => {
      const index = allQuestionsAndAnswers?.questionsAndAnswers
        ? allQuestionsAndAnswers.questionsAndAnswers.findIndex((existingQandA: SubmittedQuestionAndAnswer) => {
            return existingQandA.question === newQandA.question
          })
        : -1

      if (index !== -1) {
        // Replace the existing question with the new one
        allQuestionsAndAnswers.questionsAndAnswers[index] = newQandA
      } else {
        // Add the new question if it doesn't exist
        allQuestionsAndAnswers.questionsAndAnswers.push(newQandA)
      }
    })

    await this.store.setAssessment(req.session.id, prisonerNumber, pathway, allQuestionsAndAnswers)
  }

  async overwriteWith(req: Request, pathway: string, assessmentPage: AssessmentPage) {
    const { prisonerNumber } = req.prisonerData.personalDetails
    const questionsAndAnswers = {
      questionsAndAnswers: assessmentPage.questionsAndAnswers.map(qAndA => ({
        question: qAndA.question.id,
        questionTitle: qAndA.question.title,
        pageId: qAndA.originalPageId,
        questionType: qAndA.question.type,
        answer: qAndA.answer
          ? {
              answer: qAndA.answer.answer,
              displayText: getDisplayTextFromQandA(qAndA),
              '@class': qAndA.answer['@class'],
            }
          : null,
      })),
    }
    await this.store.setAssessment(req.session.id, prisonerNumber, pathway, questionsAndAnswers)
  }
}

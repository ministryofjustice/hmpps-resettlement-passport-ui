import { Request } from 'express'
import AssessmentStore from './assessmentStore'
import { createRedisClient } from './redisClient'

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
}

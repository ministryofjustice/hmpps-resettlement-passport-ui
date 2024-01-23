import type { RedisClient } from './redisClient'

import logger from '../../logger'
import { AssessmentPage, SubmittedInput } from './model/BCST2Form'

export default class AssessmentStore {
  private readonly assessmentPrefix = 'assessment:'

  private readonly currentPagePrefix = 'currentPage:'

  constructor(private readonly client: RedisClient) {
    client.on('error', error => {
      logger.error(error, `Redis error`)
    })
  }

  private async ensureConnected() {
    if (!this.client.isOpen) {
      await this.client.connect()
    }
  }

  public async setAssessment(
    sessionId: string,
    nomisId: string,
    pathway: string,
    questionsAndAnswers: SubmittedInput,
    durationSeconds: number,
  ): Promise<void> {
    await this.ensureConnected()
    await this.client.set(
      `${this.assessmentPrefix}${sessionId}${nomisId}${pathway}`,
      JSON.stringify(questionsAndAnswers),
      {
        EX: durationSeconds,
      },
    )
  }

  public async getAssessment(sessionId: string, nomisId: string, pathway: string): Promise<string> {
    await this.ensureConnected()
    const key = `${this.assessmentPrefix}${sessionId}${nomisId}${pathway}`
    return this.client.get(key)
  }

  public async setCurrentPage(
    sessionId: string,
    nomisId: string,
    pathway: string,
    currentPage: AssessmentPage,
    durationSeconds: number,
  ): Promise<void> {
    await this.ensureConnected()
    await this.client.set(`${this.currentPagePrefix}${sessionId}${nomisId}${pathway}`, JSON.stringify(currentPage), {
      EX: durationSeconds,
    })
  }

  public async getCurrentPage(sessionId: string, nomisId: string, pathway: string): Promise<string> {
    await this.ensureConnected()
    const key = `${this.currentPagePrefix}${sessionId}${nomisId}${pathway}`
    return this.client.get(key)
  }
}

import type { RedisClient } from './redisClient'

import logger from '../../logger'
import { AssessmentPage, SubmittedInput } from './model/BCST2Form'
import { secondsUntilMidnight } from '../utils/utils'

export default class AssessmentStore {
  private readonly assessmentPrefix = 'assessment:'

  private readonly currentPagePrefix = 'currentPage:'

  private readonly editedQuestionPrefix = 'edit:'

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
    nomsId: string,
    pathway: string,
    questionsAndAnswers: SubmittedInput,
    durationSeconds = secondsUntilMidnight(),
  ): Promise<void> {
    await this.ensureConnected()
    await this.client.set(
      `${this.assessmentPrefix}${sessionId}${nomsId}${pathway}`,
      JSON.stringify(questionsAndAnswers),
      {
        EX: durationSeconds,
      },
    )
  }

  public async getAssessment(sessionId: string, nomsId: string, pathway: string): Promise<SubmittedInput> {
    await this.ensureConnected()
    const key = `${this.assessmentPrefix}${sessionId}${nomsId}${pathway}`
    return JSON.parse(await this.client.get(key))
  }

  public async deleteAssessment(sessionId: string, nomsId: string, pathway: string) {
    await this.ensureConnected()
    const key = `${this.assessmentPrefix}${sessionId}${nomsId}${pathway}`
    await this.client.del(key)
  }

  public async setCurrentPage(
    sessionId: string,
    nomsId: string,
    pathway: string,
    currentPage: AssessmentPage,
    durationSeconds: number = secondsUntilMidnight(),
  ): Promise<void> {
    await this.ensureConnected()
    await this.client.set(`${this.currentPagePrefix}${sessionId}${nomsId}${pathway}`, JSON.stringify(currentPage), {
      EX: durationSeconds,
    })
  }

  public async getCurrentPage(sessionId: string, nomsId: string, pathway: string): Promise<string> {
    await this.ensureConnected()
    const key = `${this.currentPagePrefix}${sessionId}${nomsId}${pathway}`
    return this.client.get(key)
  }

  public async setEditedQuestionList(
    sessionId: string,
    nomsId: string,
    pathway: string,
    questionIds: string[],
    durationSeconds: number = secondsUntilMidnight(),
  ): Promise<void> {
    await this.ensureConnected()
    await this.client.set(`${this.editedQuestionPrefix}${sessionId}${nomsId}${pathway}`, JSON.stringify(questionIds), {
      EX: durationSeconds,
    })
  }

  async getEditedQuestionList(sessionId: string, nomsId: string, pathway: string): Promise<string> {
    await this.ensureConnected()
    const key = `${this.editedQuestionPrefix}${sessionId}${nomsId}${pathway}`
    return this.client.get(key)
  }

  public async deleteEditedQuestionList(sessionId: string, nomsId: string, pathway: string) {
    await this.ensureConnected()
    const key = `${this.editedQuestionPrefix}${sessionId}${nomsId}${pathway}`
    await this.client.del(key)
  }
}

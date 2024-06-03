import type { RedisClient } from './redisClient'

import logger from '../../logger'
import { AssessmentPage, SubmittedInput } from './model/immediateNeedsReport'
import { secondsUntilMidnight } from '../utils/utils'

const assessmentPrefix = 'assessment:'
const answeredQuestionsPrefix = 'answered:'
const currentPagePrefix = 'currentPage:'
const editedQuestionPrefix = 'edit:'

function buildKey(prefix: string, sessionId: string, nomsId: string, pathway: string) {
  return `${prefix}${sessionId}${nomsId}${pathway}`
}

export default class AssessmentStore {
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
    await this.client.set(buildKey(assessmentPrefix, sessionId, nomsId, pathway), JSON.stringify(questionsAndAnswers), {
      EX: durationSeconds,
    })
  }

  public async getAssessment(sessionId: string, nomsId: string, pathway: string): Promise<SubmittedInput> {
    await this.ensureConnected()
    const key = buildKey(assessmentPrefix, sessionId, nomsId, pathway)
    return JSON.parse(await this.client.get(key))
  }

  public async getAnsweredQuestions(sessionId: string, nomsId: string, pathway: string): Promise<string[]> {
    await this.ensureConnected()
    return JSON.parse(await this.client.get(buildKey(answeredQuestionsPrefix, sessionId, nomsId, pathway))) || []
  }

  public async setAnsweredQuestions(
    sessionId: string,
    nomsId: string,
    pathway: string,
    questionIds: string[],
    durationSeconds: number = secondsUntilMidnight(),
  ) {
    await this.ensureConnected()
    const key = buildKey(answeredQuestionsPrefix, sessionId, nomsId, pathway)
    await this.client.set(key, JSON.stringify(questionIds), { EX: durationSeconds })
  }

  public async deleteAssessment(sessionId: string, nomsId: string, pathway: string) {
    await this.ensureConnected()
    const key = buildKey(assessmentPrefix, sessionId, nomsId, pathway)
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
    await this.client.set(buildKey(currentPagePrefix, sessionId, nomsId, pathway), JSON.stringify(currentPage), {
      EX: durationSeconds,
    })
  }

  public async getCurrentPage(sessionId: string, nomsId: string, pathway: string): Promise<string> {
    await this.ensureConnected()
    const key = buildKey(currentPagePrefix, sessionId, nomsId, pathway)
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
    await this.client.set(buildKey(editedQuestionPrefix, sessionId, nomsId, pathway), JSON.stringify(questionIds), {
      EX: durationSeconds,
    })
  }

  async getEditedQuestionList(sessionId: string, nomsId: string, pathway: string): Promise<string[]> {
    await this.ensureConnected()
    const key = buildKey(editedQuestionPrefix, sessionId, nomsId, pathway)
    return JSON.parse(await this.client.get(key)) || []
  }

  public async deleteEditedQuestionList(sessionId: string, nomsId: string, pathway: string) {
    await this.ensureConnected()
    const key = buildKey(editedQuestionPrefix, sessionId, nomsId, pathway)
    await this.client.del(key)
  }

  public async deleteAnsweredQuestions(sessionId: string, nomsId: string, pathway: string) {
    await this.ensureConnected()
    const key = buildKey(answeredQuestionsPrefix, sessionId, nomsId, pathway)
    await this.client.del(key)
  }
}

import { hoursToSeconds } from 'date-fns'

import type { RedisClient } from './redisClient'
import logger from '../../logger'
import { AssessmentPage, SubmittedInput } from './model/immediateNeedsReport'

const defaultTimeToLive = hoursToSeconds(24 * 5)
const assessmentPrefix = 'assessment'
const answeredQuestionsPrefix = 'answered'
const currentPagePrefix = 'currentPage'
const editedQuestionPrefix = 'edit'

function buildKey(prefix: string, userId: string, nomsId: string, pathway: string) {
  return `${prefix}:${userId}:${nomsId}:${pathway}`
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
    userId: string,
    nomsId: string,
    pathway: string,
    questionsAndAnswers: SubmittedInput,
    ttl = defaultTimeToLive,
  ): Promise<void> {
    await this.ensureConnected()
    await this.client.set(buildKey(assessmentPrefix, userId, nomsId, pathway), JSON.stringify(questionsAndAnswers), {
      EX: ttl,
    })
  }

  public async getAssessment(userId: string, nomsId: string, pathway: string): Promise<SubmittedInput> {
    await this.ensureConnected()
    const key = buildKey(assessmentPrefix, userId, nomsId, pathway)
    return JSON.parse(await this.client.get(key))
  }

  public async getAnsweredQuestions(userId: string, nomsId: string, pathway: string): Promise<string[]> {
    await this.ensureConnected()
    return JSON.parse(await this.client.get(buildKey(answeredQuestionsPrefix, userId, nomsId, pathway))) || []
  }

  public async setAnsweredQuestions(
    userId: string,
    nomsId: string,
    pathway: string,
    questionIds: string[],
    durationSeconds: number = defaultTimeToLive,
  ) {
    await this.ensureConnected()
    const key = buildKey(answeredQuestionsPrefix, userId, nomsId, pathway)
    await this.client.set(key, JSON.stringify(questionIds), { EX: durationSeconds })
  }

  public async deleteAssessment(userId: string, nomsId: string, pathway: string) {
    await this.ensureConnected()
    const key = buildKey(assessmentPrefix, userId, nomsId, pathway)
    await this.client.del(key)
  }

  public async setCurrentPage(
    userId: string,
    nomsId: string,
    pathway: string,
    currentPage: AssessmentPage,
    ttl: number = defaultTimeToLive,
  ): Promise<void> {
    await this.ensureConnected()
    await this.client.set(buildKey(currentPagePrefix, userId, nomsId, pathway), JSON.stringify(currentPage), {
      EX: ttl,
    })
  }

  public async getCurrentPage(userId: string, nomsId: string, pathway: string): Promise<string> {
    await this.ensureConnected()
    const key = buildKey(currentPagePrefix, userId, nomsId, pathway)
    return this.client.get(key)
  }

  public async setEditedQuestionList(
    userId: string,
    nomsId: string,
    pathway: string,
    questionIds: string[],
    ttl: number = defaultTimeToLive,
  ): Promise<void> {
    await this.ensureConnected()
    await this.client.set(buildKey(editedQuestionPrefix, userId, nomsId, pathway), JSON.stringify(questionIds), {
      EX: ttl,
    })
  }

  async getEditedQuestionList(userId: string, nomsId: string, pathway: string): Promise<string[]> {
    await this.ensureConnected()
    const key = buildKey(editedQuestionPrefix, userId, nomsId, pathway)
    return JSON.parse(await this.client.get(key)) || []
  }

  public async deleteEditedQuestionList(userId: string, nomsId: string, pathway: string) {
    await this.ensureConnected()
    const key = buildKey(editedQuestionPrefix, userId, nomsId, pathway)
    await this.client.del(key)
  }

  public async deleteAnsweredQuestions(userId: string, nomsId: string, pathway: string) {
    await this.ensureConnected()
    const key = buildKey(answeredQuestionsPrefix, userId, nomsId, pathway)
    await this.client.del(key)
  }
}

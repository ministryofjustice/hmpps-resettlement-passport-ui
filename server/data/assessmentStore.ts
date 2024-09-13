import type { RedisClient } from './redisClient'
import logger from '../../logger'
import { AssessmentPage, SubmittedInput } from './model/immediateNeedsReport'
import config from '../config'

const defaultTimeToLive = config.redis.defaultTtlSeconds
const assessmentPrefix = 'assessment'
const answeredQuestionsPrefix = 'answered'
const currentPagePrefix = 'currentPage'
const editedQuestionPrefix = 'edit'

export interface StateKey {
  prisonerNumber?: string
  userId: string
  assessmentType: string
  pathway: string
}

function buildKey(prefix: string, key: StateKey) {
  return `${prefix}:${key.userId}:${key.prisonerNumber}:${key.assessmentType}:${key.pathway}`
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
    stateKey: StateKey,
    questionsAndAnswers: SubmittedInput,
    ttl = defaultTimeToLive,
  ): Promise<void> {
    await this.ensureConnected()
    await this.client.set(buildKey(assessmentPrefix, stateKey), JSON.stringify(questionsAndAnswers), {
      EX: ttl,
    })
  }

  public async getAssessment(stateKey: StateKey): Promise<SubmittedInput> {
    await this.ensureConnected()
    const key = buildKey(assessmentPrefix, stateKey)
    return JSON.parse(await this.client.get(key))
  }

  public async getAnsweredQuestions(stateKey: StateKey): Promise<string[]> {
    await this.ensureConnected()
    return JSON.parse(await this.client.get(buildKey(answeredQuestionsPrefix, stateKey))) || []
  }

  public async setAnsweredQuestions(
    stateKey: StateKey,
    questionIds: string[],
    durationSeconds: number = defaultTimeToLive,
  ) {
    await this.ensureConnected()
    const key = buildKey(answeredQuestionsPrefix, stateKey)
    await this.client.set(key, JSON.stringify(questionIds), { EX: durationSeconds })
  }

  public async deleteAssessment(stateKey: StateKey) {
    await this.ensureConnected()
    const key = buildKey(assessmentPrefix, stateKey)
    await this.client.del(key)
  }

  public async setCurrentPage(
    stateKey: StateKey,
    currentPage: AssessmentPage,
    ttl: number = defaultTimeToLive,
  ): Promise<void> {
    await this.ensureConnected()
    await this.client.set(buildKey(currentPagePrefix, stateKey), JSON.stringify(currentPage), {
      EX: ttl,
    })
  }

  public async getCurrentPage(stateKey: StateKey): Promise<string> {
    await this.ensureConnected()
    const key = buildKey(currentPagePrefix, stateKey)
    return this.client.get(key)
  }

  public async setEditedQuestionList(
    stateKey: StateKey,
    questionIds: string[],
    ttl: number = defaultTimeToLive,
  ): Promise<void> {
    await this.ensureConnected()
    await this.client.set(buildKey(editedQuestionPrefix, stateKey), JSON.stringify(questionIds), {
      EX: ttl,
    })
  }

  async getEditedQuestionList(stateKey: StateKey): Promise<string[]> {
    await this.ensureConnected()
    const key = buildKey(editedQuestionPrefix, stateKey)
    return JSON.parse(await this.client.get(key)) || []
  }

  public async deleteEditedQuestionList(stateKey: StateKey) {
    await this.ensureConnected()
    const key = buildKey(editedQuestionPrefix, stateKey)
    await this.client.del(key)
  }

  public async deleteAnsweredQuestions(stateKey: StateKey) {
    await this.ensureConnected()
    const key = buildKey(answeredQuestionsPrefix, stateKey)
    await this.client.del(key)
  }

  public async deleteCurrentPage(stateKey: StateKey) {
    await this.ensureConnected()
    const key = buildKey(currentPagePrefix, stateKey)
    await this.client.del(key)
  }
}

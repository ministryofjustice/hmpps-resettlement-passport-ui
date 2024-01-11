import type { RedisClient } from './redisClient'

import logger from '../../logger'

export default class AssessmentStore {
  private readonly prefix = 'assessment:'

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
    questionsAndAnswers: any,
    durationSeconds: number,
  ): Promise<void> {
    await this.ensureConnected()
    await this.client.set(`${this.prefix}${sessionId}${nomisId}${pathway}`, JSON.stringify(questionsAndAnswers), {
      EX: durationSeconds,
    })
  }

  public async getAssessment(sessionId: string, nomisId: string, pathway: string): Promise<string> {
    await this.ensureConnected()
    const key = `${this.prefix}${sessionId}${nomisId}${pathway}`
    return this.client.get(key)
  }
}

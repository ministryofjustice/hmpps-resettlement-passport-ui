import type { RedisClient } from './redisClient'
import logger from '../../logger'
import { BackupCachedAssessment, WorkingCachedAssessment } from './model/immediateNeedsReport'
import config from '../config'
import { AssessmentType } from './model/assessmentInformation'

export interface StateKey {
  prisonerNumber: string
  userId: string
  pathway: string
  assessmentType: AssessmentType
}

const defaultTimeToLive = config.redis.defaultTtlSeconds
const workingAssessmentPrefix = 'workingAssessment'
const backupAssessmentPrefix = 'backupAssessment'

function buildKey(prefix: string, stateKey: StateKey) {
  return `${prefix}:${stateKey.assessmentType}:${stateKey.userId}:${stateKey.prisonerNumber}:${stateKey.pathway}`
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

  public async setWorkingAssessment(
    stateKey: StateKey,
    assessment: WorkingCachedAssessment,
    ttl = defaultTimeToLive,
  ): Promise<void> {
    await this.ensureConnected()
    await this.client.set(buildKey(workingAssessmentPrefix, stateKey), JSON.stringify(assessment, null, 2), {
      EX: ttl,
    })
    console.log(`### Working Assessment\n${JSON.stringify(assessment, null, 2)}`)
  }

  public async getWorkingAssessment(stateKey: StateKey): Promise<WorkingCachedAssessment> {
    await this.ensureConnected()
    const key = buildKey(workingAssessmentPrefix, stateKey)
    return JSON.parse(await this.client.get(key))
  }

  public async deleteWorkingAssessment(stateKey: StateKey) {
    await this.ensureConnected()
    const key = buildKey(workingAssessmentPrefix, stateKey)
    await this.client.del(key)
  }

  public async setBackupAssessment(
    stateKey: StateKey,
    assessment: BackupCachedAssessment,
    ttl = defaultTimeToLive,
  ): Promise<void> {
    await this.ensureConnected()
    await this.client.set(buildKey(backupAssessmentPrefix, stateKey), JSON.stringify(assessment, null, 2), {
      EX: ttl,
    })
    console.log(`### Backup Assessment\n${JSON.stringify(assessment, null, 2)}`)
  }

  public async getBackupAssessment(stateKey: StateKey): Promise<BackupCachedAssessment> {
    await this.ensureConnected()
    const key = buildKey(backupAssessmentPrefix, stateKey)
    return JSON.parse(await this.client.get(key))
  }

  public async deleteBackupAssessment(stateKey: StateKey) {
    await this.ensureConnected()
    const key = buildKey(backupAssessmentPrefix, stateKey)
    await this.client.del(key)
  }
}

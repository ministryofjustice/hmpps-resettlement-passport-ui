import type { RedisClient } from './redisClient'
import logger from '../../logger'
import config from '../config'
import { SupportNeedsCache } from './model/supportNeeds'

export interface StateKey {
  prisonerNumber: string
  userId: string
  pathway: string
}

const defaultTimeToLive = config.redis.defaultTtlSeconds
const prefix = 'supportNeeds'

function buildKey(stateKey: StateKey) {
  return `${prefix}:${stateKey.userId}:${stateKey.prisonerNumber}:${stateKey.pathway}`
}

export default class SupportNeedStore {
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

  public async setSupportNeeds(
    stateKey: StateKey,
    suportNeeds: SupportNeedsCache,
    ttl = defaultTimeToLive,
  ): Promise<void> {
    await this.ensureConnected()
    await this.client.set(buildKey(stateKey), JSON.stringify(suportNeeds, null, 2), {
      EX: ttl,
    })
  }

  public async getSupportNeeds(stateKey: StateKey): Promise<SupportNeedsCache | null> {
    await this.ensureConnected()
    const key = buildKey(stateKey)
    const value = await this.client.get(key)
    if (value === null) {
      logger.error(`Failed to retrieve value from Redis for key: ${key}.`)
      return null
    }
    return JSON.parse(value)
  }

  public async deleteSupportNeeds(stateKey: StateKey): Promise<void> {
    await this.ensureConnected()
    const key = buildKey(stateKey)
    await this.client.del(key)
  }
}

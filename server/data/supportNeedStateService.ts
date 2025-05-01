// eslint-disable-next-line max-classes-per-file
import { SupportNeedsCache } from './model/supportNeeds'
import { createRedisClient } from './redisClient'
import SupportNeedStore, { StateKey } from './supportNeedStore'
import logger from '../../logger'

export function createSupportNeedStateService() {
  return new SupportNeedStateService(new SupportNeedStore(createRedisClient()))
}

export class SupportNeedStateService {
  constructor(private readonly store: SupportNeedStore) {
    // no-op
  }

  async getSupportNeeds(key: StateKey): Promise<SupportNeedsCache> {
    const supportNeeds = await this.store.getSupportNeeds(key)
    if (!supportNeeds) {
      logger.error(`Support need with key ${JSON.stringify(key)} not found in cache.`)
      throw new SupportNeedsNotFoundInCacheError(key)
    }
    return supportNeeds
  }

  async setSupportNeeds(key: StateKey, supportNeeds: SupportNeedsCache, ttl?: number): Promise<void> {
    try {
      await this.store.setSupportNeeds(key, supportNeeds, ttl)
    } catch (error) {
      throw new Error(`Failed to save support needs for key: ${JSON.stringify(key)}. Error: ${error.message}`)
    }
  }

  async deleteSupportNeeds(key: StateKey): Promise<void> {
    try {
      await this.store.deleteSupportNeeds(key)
    } catch (error) {
      throw new Error(`Failed to delete support needs for key: ${JSON.stringify(key)}. Error: ${error.message}`)
    }
  }
}

export class SupportNeedsNotFoundInCacheError extends Error {
  constructor(key: unknown) {
    super(`Support needs not found for key: ${JSON.stringify(key)}`)
    this.name = 'SupportNeedsNotFoundError'

    // Required for extending Error in TypeScript (especially for targeting ES5/ES3)
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

import { SupportNeedsCache } from './model/supportNeeds'
import { createRedisClient } from './redisClient'
import SupportNeedStore, { StateKey } from './supportNeedStore'

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
      throw new Error(`Support needs not found for key: ${JSON.stringify(key)}`)
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

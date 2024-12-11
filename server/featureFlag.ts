import { S3 } from '@aws-sdk/client-s3'
import { Cache, CacheContainer } from 'node-ts-cache'
import { MemoryStorage } from 'node-ts-cache-storage-memory'
import { readFile } from 'node:fs/promises'
import logger from '../logger'
import config from './config'

const featureFlagCache = new CacheContainer(new MemoryStorage())

export default class FeatureFlags {
  private static instance: FeatureFlags

  private s3 = new S3({ region: config.s3.featureFlag.region, forcePathStyle: true })

  private featureFlags: Map<string, boolean> = null

  public static getInstance(): FeatureFlags {
    if (!FeatureFlags.instance) {
      FeatureFlags.instance = new FeatureFlags()
    }
    return FeatureFlags.instance
  }

  @Cache(featureFlagCache, { ttl: 120 })
  private async fetchFeatureFlagsFromS3(): Promise<Feature[]> {
    try {
      const command = await this.s3.getObject({
        Bucket: config.s3.featureFlag.bucketName,
        Key: `${config.s3.featureFlag.path}/${config.s3.featureFlag.filename}`.toLowerCase(),
      })
      const data = await command.Body.transformToString()
      return JSON.parse(data) as Feature[]
    } catch (err) {
      throw new Error('Error loading feature flags from S3')
    }
  }

  private async loadFeatureFlags(): Promise<Feature[]> {
    if (!config.s3.featureFlag.enabled) {
      if (config.local.featureFlag.enabled) {
        logger.warn('Using local feature flags')
        return this.loadLocalFlags()
      }
      logger.warn('Feature flags are disabled! Returning an empty list.')
      return []
    }
    return this.fetchFeatureFlagsFromS3()
  }

  private async loadLocalFlags(): Promise<Feature[]> {
    const localFlags = await readFile(config.local.featureFlag.filename, { encoding: 'utf-8' })
    return JSON.parse(localFlags)
  }

  public async initialize(): Promise<void> {
    const featureFlags = await this.loadFeatureFlags()
    this.featureFlags = new Map(featureFlags.map(flag => [flag.feature, flag.enabled]))
  }

  public getFeatureFlag(flag: string): boolean {
    if (!this.featureFlags) {
      throw new Error('FeatureFlags not available')
    }
    if (!this.featureFlags.has(flag)) {
      throw new Error(`Feature "${flag}" does not exist.`)
    }
    return this.featureFlags.get(flag)!
  }

  public IsInitialized(): boolean {
    return this.featureFlags != null
  }
}

export interface Feature {
  feature: string
  enabled: boolean
}

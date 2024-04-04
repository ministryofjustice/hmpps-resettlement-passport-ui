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

  public static getInstance(): FeatureFlags {
    if (!FeatureFlags.instance) {
      FeatureFlags.instance = new FeatureFlags()
    }
    return FeatureFlags.instance
  }

  @Cache(featureFlagCache, { ttl: 120 })
  public async getFeatureFlags(): Promise<Feature[]> {
    if (!config.s3.featureFlag.enabled) {
      if (config.local.featureFlag.enabled) {
        logger.warn('Using local feature flags')
        return loadLocalFlags()
      }
      logger.warn('Feature flags are disabled! Returning null.')
      return null
    }
    try {
      const command = await this.s3.getObject({
        Bucket: config.s3.featureFlag.bucketName,
        Key: `${config.s3.featureFlag.path}/${config.s3.featureFlag.filename}`.toLowerCase(),
      })
      return command.Body.transformToString().then(async res => {
        return JSON.parse(res) as Promise<Feature[]>
      })
    } catch (err) {
      logger.error(err, 'Error getting feature flags from S3')
      return null
    }
  }
}

interface Feature {
  feature: string
  enabled: boolean
}

async function loadLocalFlags(): Promise<Array<Feature>> {
  const localFlags = await readFile(config.local.featureFlag.filename, { encoding: 'utf-8' })
  return JSON.parse(localFlags)
}

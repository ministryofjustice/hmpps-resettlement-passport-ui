import { S3 } from '@aws-sdk/client-s3'
import { Cache, CacheContainer } from 'node-ts-cache'
import { MemoryStorage } from 'node-ts-cache-storage-memory'
import { readFile } from 'node:fs/promises'
import logger from '../logger'
import config from './config'
import { ConfigFile } from './@types/express'

const configCache = new CacheContainer(new MemoryStorage())

export default class Config {
  private static instance: Config

  private s3 = new S3({ region: config.s3.config.region, forcePathStyle: true })

  public static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config()
    }
    return Config.instance
  }

  @Cache(configCache, { ttl: 120 })
  private async fetchConfigFromS3(): Promise<ConfigFile> {
    try {
      const command = await this.s3.getObject({
        Bucket: config.s3.config.bucketName,
        Key: `${config.s3.config.path}/${config.s3.config.filename}`.toLowerCase(),
      })
      return command.Body.transformToString().then(async res => {
        return JSON.parse(res) as Promise<ConfigFile>
      })
    } catch (err) {
      logger.error(err, 'Error getting config from S3')
      return null
    }
  }

  public async getConfig(): Promise<ConfigFile> {
    if (config.local.config.enabled) {
      logger.warn('Using local config')
      return loadLocalConfig()
    }
    return this.fetchConfigFromS3()
  }
}

async function loadLocalConfig(): Promise<ConfigFile> {
  const localConfig = await readFile(config.local.config.filename, { encoding: 'utf-8' })
  return JSON.parse(localConfig)
}

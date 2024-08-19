import { buffer } from 'node:stream/consumers'
import { Buffer } from 'buffer'
import RestClient from './restClient'
import config from '../config'

export default class RPClient {
  private restClient: RestClient

  constructor(readonly token = '', readonly sessionId = '', readonly userId = '') {
    this.restClient = new RestClient('RP API Client', config.apis.rpClient, token, sessionId, userId)
  }

  async getImageAsBase64String(path: string): Promise<string> {
    const imageStream = await this.restClient.stream({ path })
    const buffered: Buffer = await buffer(imageStream)
    return buffered.toString('base64')
  }

  async get<T>(path: string) {
    return this.restClient.get<T>({
      path,
    })
  }

  async patch(path: string, body: Record<never, never>) {
    return this.restClient.patch({
      path,
      data: body,
    })
  }

  async post(path: string, body: Record<never, never>) {
    return this.restClient.post({
      path,
      data: body,
    })
  }

  async delete(path: string) {
    return this.restClient.delete({
      path,
    })
  }

  async upload(path: string, originalFilename: string, filePath: string) {
    return this.restClient.upload({
      path,
      originalFilename,
      filePath,
    })
  }
}

export type RPError = {
  status: number
  userMessage: string
}

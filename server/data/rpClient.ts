import RestClient from './restClient'
import config from '../config'
import logger from '../../logger'

export default class RPClient {
  constructor(private readonly sessionId: string = '', private readonly userId: string = '') {}

  private static restClient(token: string): RestClient {
    return new RestClient('RP API Client', config.apis.rpClient, token)
  }

  async getImageAsBase64String(token: string, path: string): Promise<string> {
    const imageResult = (await RPClient.restClient(token).stream({
      path,
    })) as ReadableStream

    const imageBlob = await new Response(imageResult).blob()
    const imageBlobReader = await imageBlob.stream().getReader().read()
    const imageByteArray = imageBlobReader.value
    return Buffer.from(imageByteArray).toString('base64')
  }

  async get(token: string, path: string) {
    logger.info(`User: ${this.userId} Session: ${this.sessionId} making GET request to ${path}`)
    const result = await RPClient.restClient(token).get({
      path,
    })
    return result
  }

  async patch(token: string, path: string, body: Record<never, never>) {
    logger.info(`User: ${this.userId} Session: ${this.sessionId} making PATCH request to ${path}`)
    return RPClient.restClient(token).patch({
      path,
      data: body,
    })
  }

  async post(token: string, path: string, body: Record<never, never>) {
    logger.info(`User: ${this.userId} Session: ${this.sessionId} making POST request to ${path}`)
    return RPClient.restClient(token).post({
      path,
      data: body,
    })
  }

  async delete(token: string, path: string) {
    logger.info(`User: ${this.userId} Session: ${this.sessionId} making DELETE request to ${path}`)
    const result = await RPClient.restClient(token).delete({
      path,
    })
    return result
  }
}

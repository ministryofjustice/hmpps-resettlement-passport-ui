import RestClient from './restClient'
import config from '../config'

export default class RPClient {
  restClient: RestClient

  constructor(token = '', sessionId = '', userId = '') {
    this.restClient = new RestClient('RP API Client', config.apis.rpClient, token, sessionId, userId)
  }

  setToken(token: string) {
    this.restClient.token = token
  }

  async getImageAsBase64String(path: string): Promise<string> {
    const imageResult = (await this.restClient.stream({
      path,
    })) as ReadableStream

    const imageBlob = await new Response(imageResult).blob()
    const imageBlobReader = await imageBlob.stream().getReader().read()
    const imageByteArray = imageBlobReader.value
    return Buffer.from(imageByteArray).toString('base64')
  }

  async get(path: string) {
    return this.restClient.get({
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
}

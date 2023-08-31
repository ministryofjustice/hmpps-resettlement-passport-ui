import RestClient from './restClient'
import config from '../config'

export default class RPClient {
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
    const result = await RPClient.restClient(token).get({
      path,
    })
    return result
  }

  async patch(token: string, path: string, body: Record<never, never>) {
    return RPClient.restClient(token).patch({
      path,
      data: body,
    })
  }
}

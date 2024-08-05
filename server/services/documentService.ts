import { minutesToMilliseconds } from 'date-fns'
import config from '../config'
import { currentUser } from '../middleware/userContextMiddleware'

const chunkSize = 500

// eslint-disable-next-line no-shadow
const enum DocumentType {
  LICENCE_CONDITIONS = 'LICENCE_CONDITIONS',
}

const docTypes: Record<string, DocumentType> = {
  'licence-conditions': DocumentType.LICENCE_CONDITIONS,
}

export default class DocumentService {
  async upload(prisonerNumber: string, documentType: string, filename: string, data: NodeJS.ReadableStream) {
    const type = docTypes[documentType]
    const { token } = currentUser()

    if (!type) {
      throw new Error(`Unsupported document type "${documentType}"`)
    }

    const formData = new FormData()

    formData.set(
      'file',
      {
        [Symbol.toStringTag]: 'File',
        name: filename,
        stream: () =>
          new ReadableStream({
            start(controller) {
              let chunk = data.read(chunkSize)
              while (chunk != null) {
                controller.enqueue(chunk as Buffer)
                chunk = data.read(chunkSize)
              }
              controller.close()
            },
          }),
      } as unknown as Blob,
      filename,
    )

    const response = await fetch(
      `${config.apis.rpClient.url}/resettlement-passport/prisoner/${prisonerNumber}/documents/upload?category=${type}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        keepalive: true,
        signal: AbortSignal.timeout(minutesToMilliseconds(5)),
        body: formData,
      },
    )
    if (!response.ok) {
      await response.json()
      throw new Error(`Upload failed`)
    }
  }
}

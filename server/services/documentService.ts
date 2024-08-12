import { minutesToMilliseconds } from 'date-fns'
import config from '../config'
import { currentUser } from '../middleware/userContextMiddleware'
import { RPError } from '../data/rpClient'

const chunkSize = 500

// eslint-disable-next-line no-shadow
const enum DocumentType {
  LICENCE_CONDITIONS = 'LICENCE_CONDITIONS',
}

const docTypes: Record<string, DocumentType> = {
  'licence-conditions': DocumentType.LICENCE_CONDITIONS,
}

function buildFormData(filename: string, data: NodeJS.ReadableStream): FormData {
  const formData = new FormData()

  formData.set(
    'file',
    {
      [Symbol.toStringTag]: 'File',
      name: filename,
      stream: () =>
        // This is to bridge the different stream APIs, so that we don't have to load the whole
        // file into memory or write it to disk, we can just stream chunk by chunk to downstream api
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
  return formData
}

export default class DocumentService {
  async upload(prisonerNumber: string, documentType: string, filename: string, data: NodeJS.ReadableStream) {
    const type = docTypes[documentType]
    const { token } = currentUser()

    if (!type) {
      throw new Error(`Unsupported document type "${documentType}"`)
    }
    const body = buildFormData(filename, data)

    const response = await fetch(
      `${config.apis.rpClient.url}/resettlement-passport/prisoner/${prisonerNumber}/documents/upload?category=${type}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        keepalive: true,
        // Long timeout to support upload
        signal: AbortSignal.timeout(minutesToMilliseconds(5)),
        body,
      },
    )
    if (!response.ok) {
      const errorResponse: RPError = await response.json()
      throw new Error(errorResponse.userMessage)
    }
  }
}

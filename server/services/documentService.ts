import { minutesToMilliseconds } from 'date-fns'
import config from '../config'
import { currentUser } from '../middleware/userContextMiddleware'
import { RPError } from '../data/rpClient'
import { RPClient } from '../data'
import { getFeatureFlagBoolean } from '../utils/utils'
import { FEATURE_FLAGS } from '../utils/constants'

const chunkSize = 500

export type DocumentMeta = {
  id: number
  originalDocumentFileName?: string
}

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
    const { token } = currentUser()
    const type = this.readDocumentType(documentType)
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

  private readDocumentType(documentType: string) {
    const type = docTypes[documentType]
    if (!type) {
      throw new Error(`Unsupported document type "${documentType}"`)
    }
    return type
  }

  async getDocumentMeta(nomsId: string): Promise<DocumentMeta[]> {
    const enabled = getFeatureFlagBoolean(FEATURE_FLAGS.UPLOAD_DOCUMENTS)
    if (!enabled) {
      return []
    }

    const rpClient = this.createClient()

    const docs = await rpClient.get<DocumentMeta[]>(
      `/resettlement-passport/prisoner/${nomsId}/documents?category=LICENCE_CONDITIONS`,
    )
    // TODO: Find latest by type, but API is missing type on response currently
    return docs.length > 0 ? [docs[0]] : []
  }

  createClient() {
    const { token, sessionId, userId } = currentUser()
    return new RPClient(token, sessionId, userId)
  }

  async downloadDocument(prisonerNumber: string, documentType: string): Promise<ReadableStream<Uint8Array>> {
    const type = this.readDocumentType(documentType)
    const { token } = currentUser()
    const response = await fetch(
      `${config.apis.rpClient.url}/resettlement-passport/prisoner/${prisonerNumber}/documents/latest/download?category=${type}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        keepalive: true,
        signal: AbortSignal.timeout(minutesToMilliseconds(5)),
      },
    )
    if (response.ok) {
      return response.body
    }
    throw new Error(`Download failed with ${response.status} ${response.statusText}`)
  }
}

const categoryNames: Record<string, string> = {
  'licence-conditions': 'Licence conditions',
}

export function formatDocumentCategory(category: string) {
  if (!category) {
    // Temporary while api is not returning category
    return 'Licence conditions'
  }
  return categoryNames[category] || 'Unknown category'
}

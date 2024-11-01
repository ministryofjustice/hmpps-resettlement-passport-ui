import { ReadableStream } from 'stream/web'
import { minutesToMilliseconds } from 'date-fns'
import config from '../config'
import { currentUser } from '../middleware/userContextMiddleware'
import { RPClient } from '../data'
import { getFeatureFlagBoolean } from '../utils/utils'
import { FEATURE_FLAGS } from '../utils/constants'

export type DocumentMeta = {
  id: number
  fileName?: string
  originalDocumentFileName?: string
  creationDate?: Date
  category: string
}

// eslint-disable-next-line no-shadow
const enum DocumentType {
  LICENCE_CONDITIONS = 'LICENCE_CONDITIONS',
}

const docTypes: Record<string, DocumentType> = {
  'licence-conditions': DocumentType.LICENCE_CONDITIONS,
}

export default class DocumentService {
  async upload(
    prisonerNumber: string,
    documentType: string,
    originalFilename: string,
    path: string,
  ): Promise<DocumentUploadResponse> {
    const type = this.readDocumentType(documentType)

    const client = this.createClient()
    return client.upload(
      `/resettlement-passport/prisoner/${prisonerNumber}/documents/upload?category=${type}`,
      originalFilename,
      path,
    )
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

    const docs = await rpClient.get<DocumentMeta[]>(`/resettlement-passport/prisoner/${nomsId}/documents`)
    return latestByCategory(docs)
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
  const convertedCategory = category?.toLowerCase()?.replace('_', '-')
  return categoryNames[convertedCategory] || 'Unknown category'
}

export function latestByCategory(documents: DocumentMeta[]): DocumentMeta[] {
  // Note: results coming back from API are ordered, so we don't need to sort
  const seenCategories = new Set<string>()

  return documents.filter(doc => {
    if (seenCategories.has(doc.category)) {
      return false
    }
    seenCategories.add(doc.category)
    return true
  })
}

export type DocumentUploadResponse = {
  reason?: { foundViruses?: Record<string, string[]> }
}

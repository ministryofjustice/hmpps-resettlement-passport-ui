import { ReadableStream } from 'node:stream/web'
import * as stream from 'node:stream'
import { minutesToMilliseconds } from 'date-fns'
import config from '../config'
import { currentUser } from '../middleware/userContextMiddleware'
import { RPClient } from '../data'
import { getFeatureFlagBoolean } from '../utils/utils'
import { FEATURE_FLAGS } from '../utils/constants'
import { latestByCategory } from '../utils/documentUtils'
import { DocumentMeta, DocumentMetaType } from '../data/model/documents'

const docTypes: Record<string, DocumentMetaType> = {
  'licence-conditions': DocumentMetaType.LICENCE_CONDITIONS,
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

  async downloadDocument(prisonerNumber: string, documentType: string): Promise<NodeJS.ReadableStream> {
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
      return stream.Readable.fromWeb(response.body as ReadableStream<Uint8Array>)
    }
    throw new Error(`Download failed with ${response.status} ${response.statusText}`)
  }
}

export type DocumentUploadResponse = {
  reason?: { foundViruses?: Record<string, string[]> }
}

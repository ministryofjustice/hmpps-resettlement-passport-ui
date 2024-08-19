import fs from 'node:fs/promises'
import { RequestHandler } from 'express'
import formidable, { File } from 'formidable'
import DocumentService from '../../services/documentService'
import { getFeatureFlagBoolean } from '../../utils/utils'
import { FEATURE_FLAGS } from '../../utils/constants'
import config from '../../config'
import { SanitisedError } from '../../sanitisedError'
import { RPError } from '../../data/rpClient'

const errorMessageMap: Record<string, string> = {
  badFormat: 'The selected file must be a PDF, DOCX or DOC',
}

export default class DocumentController {
  constructor(private readonly documentService: DocumentService) {
    // no-op
  }

  viewUploadPage: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerData } = req
    const { uploadError } = req.query
    const errorMessageText = errorMessageMap[uploadError.toString()]
    const errorMessage = errorMessageText ? { text: errorMessageText } : null

    try {
      if (!(await getFeatureFlagBoolean(FEATURE_FLAGS.UPLOAD_DOCUMENTS))) {
        return res.redirect('/')
      }

      return res.render('pages/upload-documents', { prisonerData, errorMessage })
    } catch (error) {
      return next(error)
    }
  }

  uploadDocument: RequestHandler = async (req, res, _): Promise<void> => {
    const { prisonerNumber } = req.params
    try {
      const form = formidable({ uploadDir: config.uploadTempPath, maxFiles: 1, keepExtensions: true })

      const [fields, files] = await form.parse(req)
      const category: string = firstOrNull(fields.category)
      const file: File = firstOrNull(files.file)

      await this.documentService
        .upload(prisonerNumber, category, file.originalFilename, file.filepath)
        .finally(() => fs.unlink(file.filepath))

      return res.redirect(`/prisoner-overview/?prisonerNumber=${prisonerNumber}#documents`)
    } catch (err) {
      const rpError = (err as SanitisedError).data as RPError
      let uploadError = 'unknown'
      if (rpError.developerMessage?.includes('Unsupported document format')) {
        uploadError = 'badFormat'
      }

      return res.redirect(`/upload-documents/?prisonerNumber=${prisonerNumber}&uploadError=${uploadError}`)
    }
  }

  viewDocument: RequestHandler = async (req, res, next) => {
    try {
      if (!(await getFeatureFlagBoolean(FEATURE_FLAGS.UPLOAD_DOCUMENTS))) {
        return res.redirect('/')
      }

      const { prisonerNumber, documentType } = req.params

      const docResponse = await this.documentService.downloadDocument(prisonerNumber, documentType)
      res.setHeader('Content-Type', 'application/pdf')

      for await (const chunk of docResponse) {
        res.write(chunk)
      }
      return res.end()
    } catch (err) {
      return next(err)
    }
  }
}

function firstOrNull<T>(items: T[] | undefined): T | null {
  if (items && items.length > 0) {
    return items[0]
  }
  return null
}

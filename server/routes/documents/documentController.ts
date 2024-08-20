import fs from 'node:fs/promises'
import { RequestHandler } from 'express'
import formidable, { File } from 'formidable'
import DocumentService from '../../services/documentService'
import { getFeatureFlagBoolean } from '../../utils/utils'
import { FEATURE_FLAGS } from '../../utils/constants'
import config from '../../config'
import { SanitisedError } from '../../sanitisedError'
import { RPError } from '../../data/rpClient'
import logger from '../../../logger'

const errorMessageMap: Record<string, string> = {
  badFormat: 'The selected file must be a PDF, DOCX or DOC',
  virus: 'The selected file contains a virus',
  tooLarge: 'The selected file must be smaller than 10MB',
  empty: 'The selected file is empty',
  unknown: 'The selected file could not be uploaded – try again',
}

// Formidable exports these but they are incorrectly mapped in the @types lib, re-declaring as a workaround
const formidableErrors = {
  biggerThanTotalMaxFileSize: 1009,
  noEmptyFiles: 1010,
  maxFilesExceeded: 1015,
  biggerThanMaxFileSize: 1016,
}

export default class DocumentController {
  constructor(private readonly documentService: DocumentService) {
    // no-op
  }

  viewUploadPage: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerData } = req
    const { uploadError } = req.query
    const errorMessageText = errorMessageMap[uploadError?.toString()]
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
      const form = formidable({
        uploadDir: config.uploads.tempPath,
        maxFiles: 1,
        keepExtensions: true,
        maxFileSize: config.uploads.maxFileSizeBytes,
      })

      let category: string
      let file: File
      try {
        const [fields, files] = await form.parse(req)
        category = firstOrNull(fields.category)
        file = firstOrNull(files.file)
      } catch (err) {
        let uploadError = 'unknown'
        logger.info('Form error %s %s', err.message, JSON.stringify(err))
        if (
          err.code === formidableErrors.biggerThanTotalMaxFileSize ||
          err.code === formidableErrors.biggerThanMaxFileSize
        ) {
          uploadError = 'tooLarge'
        } else if (err.code === formidableErrors.noEmptyFiles) {
          uploadError = 'empty'
        }

        return res.redirect(`/upload-documents/?prisonerNumber=${prisonerNumber}&uploadError=${uploadError}`)
      }

      const response = await this.documentService
        .upload(prisonerNumber, category, file.originalFilename, file.filepath)
        .finally(() => fs.unlink(file.filepath))

      if (response?.reason?.foundViruses) {
        return res.redirect(`/upload-documents/?prisonerNumber=${prisonerNumber}&uploadError=virus`)
      }

      return res.redirect(`/prisoner-overview/?prisonerNumber=${prisonerNumber}#documents`)
    } catch (err) {
      const rpError = (err as SanitisedError).data as RPError
      let uploadError = 'unknown'
      if (rpError?.developerMessage?.includes('Unsupported document format')) {
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

import fs from 'node:fs/promises'
import { RequestHandler } from 'express'
import formidable, { File } from 'formidable'
import DocumentService from '../../services/documentService'
import { getFeatureFlagBoolean } from '../../utils/utils'
import { FEATURE_FLAGS } from '../../utils/constants'
import config from '../../config'

export default class DocumentController {
  constructor(private readonly documentService: DocumentService) {
    // no-op
  }

  viewUploadPage: RequestHandler = (req, res, _): void => {
    const { prisonerData } = req

    return res.render('pages/upload-documents', {
      prisonerData,
    })
  }

  uploadDocument: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerNumber } = req.params
    try {
      const form = formidable({ uploadDir: config.uploadTempPath, maxFiles: 1, keepExtensions: true })

      const [fields, files] = await form.parse(req)
      const category: string = firstOrNull(fields.category)
      const file: File = firstOrNull(files.file)

      await this.documentService
        .upload(prisonerNumber, category, file.originalFilename, file.filepath)
        .finally(() => fs.unlink(file.filepath))

      res.redirect(`/prisoner-overview/?prisonerNumber=${prisonerNumber}#documents`)
    } catch (error) {
      if (error.message?.includes('Unsupported document format')) {
        res.redirect(`/prisoner-overview/?prisonerNumber=${prisonerNumber}&uploadError=badFormat#licence-summary`)
      } else {
        next(error)
      }
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

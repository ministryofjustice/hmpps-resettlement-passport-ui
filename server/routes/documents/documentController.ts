import { RequestHandler } from 'express'
import busboy from 'busboy'
import DocumentService from '../../services/documentService'
import { getFeatureFlagBoolean } from '../../utils/utils'
import { FEATURE_FLAGS } from '../../utils/constants'

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

  uploadDocument: RequestHandler = (req, res, next): void => {
    const bb = busboy({ headers: req.headers })
    const { prisonerNumber, documentType } = req.params

    bb.on('file', (name, file, info) => {
      if (name === 'file') {
        this.documentService
          .upload(prisonerNumber, documentType, info.filename, file)
          .then(() => res.redirect(`/prisoner-overview/?prisonerNumber=${prisonerNumber}#licence-summary`))
          .catch(err => {
            if (err.message?.includes('Unsupported document format')) {
              res.redirect(`/prisoner-overview/?prisonerNumber=${prisonerNumber}&uploadError=badFormat#licence-summary`)
            } else {
              next(err)
            }
          })
      }
    })
    bb.on('error', err => next(err))
    req.pipe(bb)
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

import { RequestHandler } from 'express'
import busboy from 'busboy'
import DocumentService from '../../services/documentService'

export default class DocumentController {
  constructor(private readonly documentService: DocumentService) {
    // no-op
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
            console.log(err.message)
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
}

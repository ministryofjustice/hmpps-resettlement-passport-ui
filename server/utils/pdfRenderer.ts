/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express'
import GotenbergClient, { PdfOptions } from '../data/gotenbergClient'
import logger from '../../logger'

/*
 * This function accepts a Gotenberg client as its only argument.
 * It returns a handler function to render a normal HTML view template to
 * produce the raw HTML (including images, stylesheet etc). It then uses a
 * callback function to pass rendered HTML view into the Gotenberg client
 * to produce and return a PDF document.
 */
export default function pdfRenderer(client: GotenbergClient) {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  return (req: Request, res: Response, next: NextFunction) => {
    res.renderPDF = (
      view: string,
      pageData: Record<string, unknown>,
      options: { filename: string; pdfOptions: PdfOptions } = { filename: 'document.pdf', pdfOptions: {} },
    ): any => {
      res.render(view, pageData, (error: any, html: any) => {
        if (error) {
          throw error
        }

        res.header('Content-Type', 'application/pdf')
        res.header('Content-Transfer-Encoding', 'binary')
        res.header('Content-Disposition', `inline; filename=${options.filename}`)

        return client
          .renderPdfFromHtml(html, options?.pdfOptions)
          .then(buffer => res.send(buffer))
          .catch(reason => {
            logger.warn(reason)
          })
      })
    }
    next()
  }
}

import superagent from 'superagent'
import logger from '../../logger'

export type PdfOptions = {
  headerHtml?: string
  footerHtml?: string
  marginTop?: string
  marginBottom?: string
  marginLeft?: string
  marginRight?: string
}

export default class GotenbergClient {
  private gotenbergHost: string

  constructor(gotenbergHost: string) {
    this.gotenbergHost = gotenbergHost
  }

  async renderPdfFromHtml(html: string, headerHtml: string, options: PdfOptions = {}): Promise<Buffer> {
    const { marginBottom, marginLeft, marginRight, marginTop } = options

    const footerHtml = `
    <html>
    <head>
        <style>
        body {
            font-size: 12px;
            margin: auto 20px;
        }
        </style>
    </head>
    <body>
    <p><span class="pageNumber"></span> of <span class="totalPages"></span></p>
    </body>
    </html> 
    `

    try {
      const request = superagent
        .post(`${this.gotenbergHost}/forms/chromium/convert/html`)
        .attach('files', Buffer.from(html), 'index.html')
        .attach('files', Buffer.from(headerHtml), 'header.html')
        .attach('files', Buffer.from(footerHtml), 'footer.html')
        .responseType('blob')

      // Set paper size to A4. Page size and margins specified in inches
      request.field('paperWidth', 8.27)
      request.field('paperHeight', 11.7)
      request.field('singlePage', false)
      if (marginTop) request.field('marginTop', marginTop)
      if (marginBottom) request.field('marginBottom', marginBottom)
      if (marginLeft) request.field('marginLeft', marginLeft)
      if (marginRight) request.field('marginRight', marginRight)

      // Execute the POST to the Gotenberg container
      const response = await request
      return response.body
    } catch (err) {
      logger.error(`Error POST to gotenberg:/forms/chromium/convert/html - {}`, err)
      return undefined
    }
  }
}

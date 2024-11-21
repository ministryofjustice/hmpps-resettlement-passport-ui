import { RequestHandler } from 'express'

export default class ServiceUpdatesController {
  getView: RequestHandler = (req, res): void => {
    const { page } = req.params
    const template = page ? `pages/service-updates/${page}` : 'pages/service-updates'

    res.render(template, (err: Error | null, html: string | undefined) => {
      if (err) {
        res.status(404).send('Page not found')
      } else {
        res.send(html)
      }
    })
  }
}

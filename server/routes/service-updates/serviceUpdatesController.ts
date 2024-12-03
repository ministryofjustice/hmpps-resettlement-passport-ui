import { RequestHandler } from 'express'

export default class ServiceUpdatesController {
  getServiceUpdatesView: RequestHandler = (req, res): void => {
    const whatsNewVersion = req.config.whatsNew?.version
    res.render('pages/service-updates', { whatsNewVersion })
  }

  getServiceUpdatesDetailsView: RequestHandler = (req, res): void => {
    const { page } = req.params
    res.render(`pages/service-updates/${page}`)
  }
}

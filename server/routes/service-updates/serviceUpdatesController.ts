import { RequestHandler } from 'express'
import Banner from '../../banner'

export default class ServiceUpdatesController {
  getServiceUpdatesView: RequestHandler = (req, res): void => {
    const whatsNewVersion = req.config.whatsNew?.version
    const banners = Banner.getBanners().filter(banner => banner.version <= whatsNewVersion)

    res.render('pages/service-updates', { banners })
  }

  getServiceUpdatesDetailsView: RequestHandler = (req, res): void => {
    const { page } = req.params
    res.render(`pages/service-updates/${page}`)
  }
}

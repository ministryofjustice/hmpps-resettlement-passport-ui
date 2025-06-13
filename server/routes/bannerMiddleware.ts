import { RequestHandler } from 'express'
import { milliseconds } from 'date-fns'
import config from '../config'
import Banner from '../banner'

const expiryTime = milliseconds({ years: 1 })

function cookieId(userId: string) {
  return `whatsnew-${userId}`
}

export default function bannerMiddleware(): RequestHandler {
  return async (req, res, next) => {
    if (!req.config.whatsNew?.enabled) {
      res.locals.whatsNewEnabled = false
    } else {
      const version = req.config.whatsNew?.version
      const { username } = req.user

      let dismissCookieSet = req.cookies[cookieId(username)] === version
      if (req.query.dismissWhatsNew === 'true') {
        dismissCookieSet = true
        res.cookie(cookieId(username), version, { httpOnly: true, secure: true, maxAge: expiryTime, sameSite: 'lax' })
      }

      res.locals.whatsNewEnabled = !dismissCookieSet
      res.locals.whatsNewVersion = version

      const url = new URL(req.url, config.domain)
      url.searchParams.append('dismissWhatsNew', 'true')
      res.locals.whatsNewDismissUrl = url.href

      res.locals.banner = Banner.getWhatsNewBannerVersion(version)
    }
    next()
  }
}

import { Request, Response } from 'express'
import { millisecondsToSeconds, milliseconds } from 'date-fns'
import config from '../config'

const expiryTime = millisecondsToSeconds(milliseconds({ years: 1 }))

function cookieId(userId: string) {
  return `whatsnew-${userId}`
}

export function handleWhatsNewBanner(req: Request, res: Response) {
  if (!req.config.whatsNew?.enabled) {
    res.locals.whwhatsNewEnabled = false
    return
  }
  const version = req.config.whatsNew?.version
  const { username } = req.user

  let dismissCookieSet = req.cookies[cookieId(username)] === version
  if (req.query.dismissWhatsNew === 'true') {
    dismissCookieSet = true
    res.cookie(cookieId(username), version, { httpOnly: true, secure: true, maxAge: expiryTime })
  }

  res.locals.whatsNewEnabled = !dismissCookieSet
  res.locals.whatsNewVersion = version

  const url = new URL(req.url, config.domain)
  url.searchParams.append('dismissWhatsNew', 'true')
  res.locals.whatsNewDismissUrl = url.href
}

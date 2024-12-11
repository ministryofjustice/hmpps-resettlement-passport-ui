import type { NextFunction, Request, Response } from 'express'
import type { HTTPError } from 'superagent'
import logger from '../logger'
import config from './config'

interface CustomHTTPError extends HTTPError {
  customMessage?: string
}

const defaultErrorMessage = 'Something went wrong'

export default function createErrorHandler(production: boolean) {
  return (error: CustomHTTPError, req: Request, res: Response, _: NextFunction): void => {
    logger.error(`Error handling request for '${req.originalUrl}', user '${res.locals.user?.username}'`, error)

    if (config.local.signOutOnFailure && (error.status === 401 || error.status === 403)) {
      logger.info('Logging user out')
      return res.redirect('/sign-out')
    }

    if (error.customMessage) {
      res.locals.message = error.customMessage
    } else {
      if (production) {
        res.locals.message = defaultErrorMessage
      } else {
        res.locals.message = error.message
      }
      res.locals.status = production ? null : error.status
      res.locals.stack = production ? null : error.stack
    }

    res.status(error.status || 500)

    // Defaulting this to off for error screen
    const whatsNewBannerEnabled = false

    return res.render('pages/error', { whatsNewBannerEnabled })
  }
}

export function badRequestError(message?: string, customMessage: string = defaultErrorMessage): CustomHTTPError {
  const error = new Error(message) as CustomHTTPError
  error.status = 400
  error.customMessage = customMessage
  return error
}

import type { Request, Response, NextFunction } from 'express'
import type { HTTPError } from 'superagent'
import logger from '../logger'

interface CustomHTTPError extends HTTPError {
  customMessage?: string
}

export default function createErrorHandler(production: boolean) {
  return (error: CustomHTTPError, req: Request, res: Response, next: NextFunction): void => {
    logger.error(`Error handling request for '${req.originalUrl}', user '${res.locals.user?.username}'`, error)

    if (error.status === 401 || error.status === 403) {
      logger.info('Logging user out')
      return res.redirect('/sign-out')
    }

    if (error.customMessage) {
      res.locals.message = error.customMessage
    } else {
      if (production) {
        res.locals.message = 'Something went wrong'
      } else {
        res.locals.message = error.message
      }
      res.locals.status = production ? null : error.status
      res.locals.stack = production ? null : error.stack
    }

    res.status(error.status || 500)

    return res.render('pages/error')
  }
}

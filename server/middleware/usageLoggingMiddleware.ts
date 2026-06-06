import { RequestHandler } from 'express'
import logger from '../../logger'

const usageLoggingMiddleware = (): RequestHandler => {
  return async (req, res, next) => {
    logger.info(
      `User: ${req.user.username} Session: ${req.sessionID} Auth Source: ${req.user.authSource} requested page ${req.url}`,
    )
    next()
  }
}

export default usageLoggingMiddleware

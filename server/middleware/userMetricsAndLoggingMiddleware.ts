import { RequestHandler } from 'express'
import userMetricsCounter from '../monitoring/customMetrics'
import logger from '../../logger'

const userMetricsAndLoggingMiddleware = (): RequestHandler => {
  return async (req, res, next) => {
    logger.info(
      `User: ${req.user.username} Session: ${req.sessionID} Auth Source: ${req.user.authSource} requested page ${req.url}`,
    )
    userMetricsCounter.inc({
      path: req.path.toLowerCase(),
      auth_type: res.locals.user.authSource,
      ...(res.locals.userActiveCaseLoad && { caseload: res.locals.userActiveCaseLoad.description }),
    })
    next()
  }
}

export default userMetricsAndLoggingMiddleware

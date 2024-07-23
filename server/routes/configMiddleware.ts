import { NextFunction, Request, Response } from 'express'
import logger from '../../logger'
import Config from '../s3Config'

export default function configMiddleware() {
  return async (req: Request, res: Response, next: NextFunction) => {
    let configFile = null

    try {
      const config = Config.getInstance()
      configFile = await config.getConfig()
      if (!configFile) {
        logger.warn('No config available, returning false.')
        throw new Error('No config available.')
      }
    } catch (err) {
      next(err)
      return
    }

    req.config = configFile
    next()
  }
}

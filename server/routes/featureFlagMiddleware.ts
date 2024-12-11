import { NextFunction, Request, Response } from 'express'
import FeatureFlags from '../featureFlag'

export default function featureFlagMiddleware() {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const featureFlags = FeatureFlags.getInstance()
      await featureFlags.initialize()
    } catch (err) {
      next(err)
      return
    }
    next()
  }
}

import { Request, Response, NextFunction } from 'express'
import { FEATURE_FLAGS } from '../utils/constants'
import { getFeatureFlagBoolean } from '../utils/utils'

export async function readOnlyGuard(req: Request, res: Response, next: NextFunction) {
  const readOnlyMode = await getFeatureFlagBoolean(FEATURE_FLAGS.READ_ONLY_MODE)

  if (readOnlyMode) {
    res.status(404).render('pages/read-only-mode')
  } else {
    next()
  }
}

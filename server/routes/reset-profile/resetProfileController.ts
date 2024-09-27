import { RequestHandler } from 'express'
import RpService from '../../services/rpService'
import { FEATURE_FLAGS } from '../../utils/constants'
import logger from '../../../logger'
import { getFeatureFlagBoolean } from '../../utils/utils'
import ResetProfileView from './resetProfileView'

export default class ResetProfileController {
  constructor(private readonly rpService: RpService) {
    // no op
  }

  resetProfile: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const { prisonerData } = req
      const resetProfileEnabled = await getFeatureFlagBoolean(FEATURE_FLAGS.RESET_PROFILE)

      if (resetProfileEnabled) {
        logger.info('Feature flag resetProfile: ', resetProfileEnabled)
      }

      const view = new ResetProfileView(prisonerData, resetProfileEnabled)

      res.render('pages/reset-profile', { ...view.renderArgs })
    } catch (err) {
      next(err)
    }
  }
}

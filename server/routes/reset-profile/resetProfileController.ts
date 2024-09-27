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
      const { prisonerNumber } = prisonerData.personalDetails
      const resetProfileEnabled = await getFeatureFlagBoolean(FEATURE_FLAGS.RESET_PROFILE)
      logger.info('Feature flag resetProfile: ', resetProfileEnabled)

      if (resetProfileEnabled) {
        console.log('resetProfile flag enabled')
      }

      const view = new ResetProfileView(prisonerData, resetProfileEnabled)

      res.render('pages/reset-profile', { ...view.renderArgs })
    } catch (err) {
      next(err)
    }
  }
}

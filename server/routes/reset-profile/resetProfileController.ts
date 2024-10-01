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

      if (!resetProfileEnabled) {
        return next(new Error('Reset profile is disabled'))
      }

      const view = new ResetProfileView(prisonerData)

      return res.render('pages/reset-profile', { ...view.renderArgs })
    } catch (err) {
      return next(err)
    }
  }
}

import { RequestHandler } from 'express'
import RpService from '../../services/rpService'
import { FEATURE_FLAGS } from '../../utils/constants'
import { getFeatureFlagBoolean } from '../../utils/utils'
import ResetProfileView from './resetProfileView'
import { ResetProfileValidationError, ResetReason } from '../../data/model/resetProfile'

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

  resetProfileReason: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const { prisonerData } = req
      const resetProfileEnabled = await getFeatureFlagBoolean(FEATURE_FLAGS.RESET_PROFILE)

      if (!resetProfileEnabled) {
        return next(new Error('Reset profile is disabled'))
      }

      const view = new ResetProfileView(prisonerData)

      return res.render('pages/reset-profile-reason', { ...view.renderArgs })
    } catch (err) {
      return next(err)
    }
  }

  submitResetProfileReason: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const { prisonerData } = req
      const { resetReason, additionalDetails } = req.body
      let validationError: ResetProfileValidationError
      const resetProfileEnabled = await getFeatureFlagBoolean(FEATURE_FLAGS.RESET_PROFILE)

      if (!resetProfileEnabled) {
        return next(new Error('Reset profile is disabled'))
      }

      if (!resetReason) {
        validationError = 'MANDATORY_REASON'
        const view = new ResetProfileView(prisonerData, validationError)
        return res.render('pages/reset-profile-reason', { ...view.renderArgs })
      }

      if (resetReason === 'OTHER' && !additionalDetails) {
        validationError = 'MANDATORY_OTHER_TEXT'
        const view = new ResetProfileView(prisonerData, validationError)
        return res.render('pages/reset-profile-reason', { ...view.renderArgs })
      }

      if (resetReason === 'OTHER' && additionalDetails?.length > 3000) {
        validationError = 'MAX_CHARACTER_LIMIT_LONG_TEXT'
        const view = new ResetProfileView(prisonerData, validationError, resetReason, additionalDetails)
        return res.render('pages/reset-profile-reason', { ...view.renderArgs })
      }

      const resetReasonPostBody: ResetReason = {
        resetReason,
        additionalDetails: resetReason === 'OTHER' ? additionalDetails : null,
      }

      const resetReasonTextMap: Record<string, string> = {
        OTHER: 'Other',
        RECALL_TO_PRISON: 'The person has been recalled to prison',
        RETURN_ON_NEW_SENTENCE: 'The person has returned to prison on a new sentence',
      }

      const resetReasonDisplayText = resetReasonTextMap[resetReason]

      const resetProfileResponse = await this.rpService.resetProfile(
        prisonerData.personalDetails.prisonerNumber,
        resetReasonPostBody,
      )

      // Check if profile reset successfully
      if (resetProfileResponse?.error) {
        return next(new Error(resetProfileResponse.error))
      }

      const userName = res.locals.user.displayName
      const view = new ResetProfileView(
        prisonerData,
        validationError,
        resetReason,
        additionalDetails,
        userName,
        resetReasonDisplayText,
      )

      return res.render('pages/reset-profile-success', { ...view.renderArgs })
    } catch (err) {
      return next(err)
    }
  }
}

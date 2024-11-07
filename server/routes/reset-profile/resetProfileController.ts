import { RequestHandler } from 'express'
import NodeClient from 'applicationinsights/out/Library/NodeClient'
import RpService from '../../services/rpService'
import { FEATURE_FLAGS } from '../../utils/constants'
import { getFeatureFlagBoolean } from '../../utils/utils'
import ResetProfileView from './resetProfileView'
import {
  MANDATORY_OTHER_TEXT,
  MANDATORY_REASON,
  MAX_CHARACTER_LIMIT_LONG_TEXT,
  ResetProfileValidationError,
  ResetReason,
} from '../../data/model/resetProfile'
import { PsfrEvent, trackEvent } from '../../utils/analytics'

export default class ResetProfileController {
  constructor(private readonly rpService: RpService, private readonly appInsightsClient: NodeClient) {
    // no op
  }

  resetProfile: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const { prisonerData } = req
      const resetProfileEnabled = await getFeatureFlagBoolean(FEATURE_FLAGS.RESET_PROFILE)

      if (!resetProfileEnabled) {
        return next(new Error('Reset profile is disabled'))
      }

      return res.render('pages/reset-profile', { prisonerData })
    } catch (err) {
      return next(err)
    }
  }

  resetProfileReason: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const { prisonerData } = req
      const validationError = req.flash('validationError')?.[0] as unknown as ResetProfileValidationError
      const additionalDetails = req.flash('additionalDetails')?.[0]
      const resetProfileEnabled = await getFeatureFlagBoolean(FEATURE_FLAGS.RESET_PROFILE)

      if (!resetProfileEnabled) {
        return next(new Error('Reset profile is disabled'))
      }

      const view = new ResetProfileView(prisonerData, validationError, additionalDetails)

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
        validationError = MANDATORY_REASON
      } else if (resetReason === 'OTHER' && additionalDetails?.length === 0) {
        validationError = MANDATORY_OTHER_TEXT
      } else if (resetReason === 'OTHER' && additionalDetails?.length > 3000) {
        validationError = MAX_CHARACTER_LIMIT_LONG_TEXT
      }

      if (validationError) {
        req.flash('validationError', validationError)
        req.flash('additionalDetails', additionalDetails)
        return res.redirect(`/resetProfile/reason?prisonerNumber=${prisonerData.personalDetails.prisonerNumber}`)
      }

      const resetReasonPostBody: ResetReason = {
        resetReason,
        additionalDetails: resetReason === 'OTHER' ? additionalDetails : null,
      }

      const resetProfileResponse = await this.rpService.resetProfile(
        prisonerData.personalDetails.prisonerNumber,
        resetReasonPostBody,
      )

      // Check if profile reset successfully
      if (resetProfileResponse?.error) {
        return next(new Error(resetProfileResponse.error))
      }

      trackEvent(this.appInsightsClient, PsfrEvent.PROFILE_RESET_EVENT, {
        prisonerId: prisonerData.personalDetails.prisonerNumber,
        sessionId: req.sessionID,
        reason: resetReason,
      })

      return res.redirect(`/resetProfile/success?prisonerNumber=${prisonerData.personalDetails.prisonerNumber}`)
    } catch (err) {
      return next(err)
    }
  }

  resetProfileSuccess: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const { prisonerData } = req

      const resetProfileEnabled = await getFeatureFlagBoolean(FEATURE_FLAGS.RESET_PROFILE)
      if (!resetProfileEnabled) {
        return next(new Error('Reset profile is disabled'))
      }

      return res.render('pages/reset-profile-success', { prisonerData })
    } catch (err) {
      return next(err)
    }
  }
}

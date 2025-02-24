import { RequestHandler } from 'express'
import PrisonerDetailsService from '../../services/prisonerDetailsService'
import { handleWhatsNewBanner } from '../whatsNewBanner'
import { FEATURE_FLAGS } from '../../utils/constants'
import { getFeatureFlagBoolean } from '../../utils/utils'

export default class CaseNoteController {
  constructor(private readonly prisonerDetailsService: PrisonerDetailsService) {
    // no op
  }

  getView: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const supportNeedsEnabled = await getFeatureFlagBoolean(FEATURE_FLAGS.SUPPORT_NEEDS)
      const prisonerData = await this.prisonerDetailsService.loadPrisonerDetailsFromParam(req, res)

      if (supportNeedsEnabled) {
        return res.redirect(
          `prisoner-overview/?prisonerNumber=${prisonerData.personalDetails.prisonerNumber}#case-notes`,
        )
      }

      handleWhatsNewBanner(req, res)

      return res.render('pages/add-case-note', {
        prisonerData,
      })
    } catch (err) {
      return next(err)
    }
  }
}

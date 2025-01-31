import { RequestHandler } from 'express'
import RpService from '../../services/rpService'
import AttitudesThinkingBehaviour from './attitudesThinkingBehaviourView'
import PrisonerDetailsService from '../../services/prisonerDetailsService'
import { handleWhatsNewBanner } from '../whatsNewBanner'

export default class AttitudesThinkingBehaviourController {
  constructor(
    private readonly prisonService: RpService,
    private readonly prisonerDetailsService: PrisonerDetailsService,
  ) {
    // no op
  }

  getView: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const prisonerData = await this.prisonerDetailsService.loadPrisonerDetailsFromParam(req, res, true)

      handleWhatsNewBanner(req, res)

      const {
        page = '0',
        pageSize = '10',
        sort = 'occurenceDateTime%2CDESC',
        days = '0',
        createdByUserId = '0',
      } = req.query

      const crsReferrals = await this.prisonService.getCrsReferrals(
        prisonerData.personalDetails.prisonerNumber as string,
        'ATTITUDES_THINKING_AND_BEHAVIOUR',
      )

      const assessmentData = await this.prisonService.getAssessmentInformation(
        prisonerData.personalDetails.prisonerNumber as string,
        'ATTITUDES_THINKING_AND_BEHAVIOUR',
      )

      const caseNotesData = await this.prisonService.getCaseNotesHistory(
        prisonerData.personalDetails.prisonerNumber as string,
        'ATTITUDES_THINKING_AND_BEHAVIOUR',
        createdByUserId as string,
        pageSize as string,
        page as string,
        sort as string,
        days as string,
      )

      const caseNotesCreators = await this.prisonService.getCaseNotesCreators(
        prisonerData.personalDetails.prisonerNumber as string,
        'ATTITUDES_THINKING_AND_BEHAVIOUR',
      )

      const pathwaySupportNeedsSummary = await this.prisonService.getPathwaySupportNeedsSummary(
        prisonerData.personalDetails.prisonerNumber as string,
        'ATTITUDES_THINKING_AND_BEHAVIOUR',
      )

      const view = new AttitudesThinkingBehaviour(
        prisonerData,
        crsReferrals,
        assessmentData,
        caseNotesData,
        caseNotesCreators,
        createdByUserId as string,
        pageSize as string,
        page as string,
        sort as string,
        days as string,
        pathwaySupportNeedsSummary,
      )
      return res.render('pages/attitudes-thinking-behaviour', { ...view.renderArgs })
    } catch (err) {
      return next(err)
    }
  }
}

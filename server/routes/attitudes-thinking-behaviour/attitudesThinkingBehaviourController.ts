import { RequestHandler } from 'express'
import RpService from '../../services/rpService'
import AttitudesThinkingBehaviour from './attitudesThinkingBehaviourView'

export default class AttitudesThinkingBehaviourController {
  constructor(private readonly prisonService: RpService) {
    // no op
  }

  getView: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const { prisonerData } = req
      if (!prisonerData) {
        return next(new Error('Prisoner number is missing from request'))
      }

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
      )
      return res.render('pages/attitudes-thinking-behaviour', { ...view.renderArgs })
    } catch (err) {
      return next(err)
    }
  }
}

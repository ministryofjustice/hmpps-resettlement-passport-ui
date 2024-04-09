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
      const { token } = req.user
      const crsReferrals = await this.prisonService.getCrsReferrals(
        token,
        req.sessionID,
        prisonerData.personalDetails.prisonerNumber as string,
        'ATTITUDES_THINKING_AND_BEHAVIOUR',
      )

      const assessmentData = await this.prisonService.getAssessmentInformation(
        token,
        req.sessionID,
        prisonerData.personalDetails.prisonerNumber as string,
        'ATTITUDES_THINKING_AND_BEHAVIOUR',
      )

      const view = new AttitudesThinkingBehaviour(prisonerData, crsReferrals, assessmentData)
      res.render('pages/attitudes-thinking-behaviour', { ...view.renderArgs })
    } catch (err) {
      next(err)
    }
  }
}

import { RequestHandler } from 'express'
import RpService from '../../services/rpService'
import AttitudesThinkingBehaviour from './attitudesThinkingBehaviourView'

export default class AttitudesThinkingBehaviourController {
  constructor(private readonly prisonService: RpService) {}

  getView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerData, BCST2Submitted } = req
    const { token } = req.user
    const crsReferrals = await this.prisonService.getCrsReferrals(
      token,
      req.sessionID,
      prisonerData.personalDetails.prisonerNumber as string,
      'ATTITUDES_THINKING_AND_BEHAVIOUR',
    )

    const view = new AttitudesThinkingBehaviour(prisonerData, BCST2Submitted, crsReferrals)
    res.render('pages/attitudes-thinking-behaviour', { ...view.renderArgs })
  }
}

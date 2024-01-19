import { RequestHandler } from 'express'
import RpService from '../../services/rpService'
import BCST2FormView from './BCST2FormView'

export default class BCST2FormController {
  constructor(private readonly rpService: RpService) {}

  getView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerData } = req
    const { token } = req.user

    const nextPage = await this.rpService.getNextPage(
      token,
      req.sessionID,
      prisonerData.personalDetails.prisonerNumber as string,
      'ACCOMMODATION',
    )

    const assessmentPage = await this.rpService.getAssessmentPage(
      token,
      req.sessionID,
      prisonerData.personalDetails.prisonerNumber as string,
      'ACCOMMODATION',
      nextPage.nextPageId,
    )

    console.log(nextPage, assessmentPage)
    const view = new BCST2FormView(prisonerData, assessmentPage)
    res.render('pages/BCST2-form', { ...view.renderArgs })
  }
}

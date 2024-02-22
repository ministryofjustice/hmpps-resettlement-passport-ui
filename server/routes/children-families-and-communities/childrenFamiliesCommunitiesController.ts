import { RequestHandler } from 'express'
import RpService from '../../services/rpService'
import ChildrenFamiliesCommunitiesView from './childrenFamiliesCommunitiesView'

export default class ChildrenFamiliesCommunitiesController {
  constructor(private readonly rpService: RpService) {}

  getView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerData } = req
    const { token } = req.user
    const crsReferrals = await this.rpService.getCrsReferrals(
      token,
      req.sessionID,
      prisonerData.personalDetails.prisonerNumber as string,
      'CHILDREN_FAMILIES_AND_COMMUNITY',
    )

    const assessmentData = await this.rpService.getAssessmentInformation(
      token,
      req.sessionID,
      prisonerData.personalDetails.prisonerNumber as string,
      'CHILDREN_FAMILIES_AND_COMMUNITY',
    )

    const view = new ChildrenFamiliesCommunitiesView(prisonerData, crsReferrals, assessmentData)
    res.render('pages/children-families-communities', { ...view.renderArgs })
  }
}

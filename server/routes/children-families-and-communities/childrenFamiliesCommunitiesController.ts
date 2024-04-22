import { RequestHandler } from 'express'
import RpService from '../../services/rpService'
import ChildrenFamiliesCommunitiesView from './childrenFamiliesCommunitiesView'

export default class ChildrenFamiliesCommunitiesController {
  constructor(private readonly rpService: RpService) {
    // no op
  }

  getView: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const { prisonerData } = req
      const { token } = req.user
      const {
        page = '0',
        pageSize = '10',
        sort = 'occurenceDateTime%2CDESC',
        days = '0',
        createdByUserId = '0',
      } = req.query

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

      const caseNotesData = await this.rpService.getCaseNotesHistory(
        token,
        req.sessionID,
        prisonerData.personalDetails.prisonerNumber as string,
        'CHILDREN_FAMILIES_AND_COMMUNITY',
        createdByUserId as string,
        pageSize as string,
        page as string,
        sort as string,
        days as string,
      )

      const caseNotesCreators = await this.rpService.getCaseNotesCreators(
        token,
        req.sessionID,
        prisonerData.personalDetails.prisonerNumber as string,
        'CHILDREN_FAMILIES_AND_COMMUNITY',
      )

      const view = new ChildrenFamiliesCommunitiesView(
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
      res.render('pages/children-families-communities', { ...view.renderArgs })
    } catch (err) {
      next(err)
    }
  }
}

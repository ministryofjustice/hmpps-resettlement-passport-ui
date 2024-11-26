import { RequestHandler } from 'express'
import RpService from '../../services/rpService'
import ChildrenFamiliesCommunitiesView from './childrenFamiliesCommunitiesView'
import PrisonerDetailsService from '../../services/prisonerDetailsService'
import { handleWhatsNewBanner } from '../whatsNewBanner'

export default class ChildrenFamiliesCommunitiesController {
  constructor(private readonly rpService: RpService, private readonly prisonerDetailsService: PrisonerDetailsService) {
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

      const crsReferrals = await this.rpService.getCrsReferrals(
        prisonerData.personalDetails.prisonerNumber as string,
        'CHILDREN_FAMILIES_AND_COMMUNITY',
      )

      const assessmentData = await this.rpService.getAssessmentInformation(
        prisonerData.personalDetails.prisonerNumber as string,
        'CHILDREN_FAMILIES_AND_COMMUNITY',
      )

      const caseNotesData = await this.rpService.getCaseNotesHistory(
        prisonerData.personalDetails.prisonerNumber as string,
        'CHILDREN_FAMILIES_AND_COMMUNITY',
        createdByUserId as string,
        pageSize as string,
        page as string,
        sort as string,
        days as string,
      )

      const caseNotesCreators = await this.rpService.getCaseNotesCreators(
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
      return res.render('pages/children-families-communities', { ...view.renderArgs })
    } catch (err) {
      return next(err)
    }
  }
}

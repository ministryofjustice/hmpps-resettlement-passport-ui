import { RequestHandler } from 'express'
import RpService from '../../services/rpService'
import EducationSkillsWorkView from './educationSkillsWorkView'
import PrisonerDetailsService from '../../services/prisonerDetailsService'
import { handleWhatsNewBanner } from '../whatsNewBanner'

export default class EducationSkillsWorkController {
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
        'EDUCATION_SKILLS_AND_WORK',
      )

      const educationSkillsWork = await this.rpService.getEducationSkillsWork(
        prisonerData.personalDetails.prisonerNumber as string,
      )

      const assessmentData = await this.rpService.getAssessmentInformation(
        prisonerData.personalDetails.prisonerNumber as string,
        'EDUCATION_SKILLS_AND_WORK',
      )

      const caseNotesData = await this.rpService.getCaseNotesHistory(
        prisonerData.personalDetails.prisonerNumber as string,
        'EDUCATION_SKILLS_AND_WORK',
        createdByUserId as string,
        pageSize as string,
        page as string,
        sort as string,
        days as string,
      )

      const caseNotesCreators = await this.rpService.getCaseNotesCreators(
        prisonerData.personalDetails.prisonerNumber as string,
        'EDUCATION_SKILLS_AND_WORK',
      )

      const view = new EducationSkillsWorkView(
        prisonerData,
        crsReferrals,
        educationSkillsWork,
        assessmentData,
        caseNotesData,
        caseNotesCreators,
        createdByUserId as string,
        pageSize as string,
        page as string,
        sort as string,
        days as string,
      )
      return res.render('pages/education-skills-work', { ...view.renderArgs })
    } catch (err) {
      return next(err)
    }
  }
}

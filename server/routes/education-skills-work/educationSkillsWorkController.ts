import { RequestHandler } from 'express'
import RpService from '../../services/rpService'
import EducationSkillsWorkView from './educationSkillsWorkView'

export default class EducationSkillsWorkController {
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
        'EDUCATION_SKILLS_AND_WORK',
      )

      const educationSkillsWork = await this.rpService.getEducationSkillsWork(
        token,
        req.sessionID,
        prisonerData.personalDetails.prisonerNumber as string,
      )

      const assessmentData = await this.rpService.getAssessmentInformation(
        token,
        req.sessionID,
        prisonerData.personalDetails.prisonerNumber as string,
        'EDUCATION_SKILLS_AND_WORK',
      )

      const caseNotesData = await this.rpService.getCaseNotesHistory(
        token,
        req.sessionID,
        prisonerData.personalDetails.prisonerNumber as string,
        'EDUCATION_SKILLS_AND_WORK',
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
      res.render('pages/education-skills-work', { ...view.renderArgs })
    } catch (err) {
      next(err)
    }
  }
}

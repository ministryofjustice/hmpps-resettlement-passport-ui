import { RequestHandler } from 'express'
import RpService from '../../services/rpService'
import EducationSkillsWorkView from './educationSkillsWorkView'

export default class EducationSkillsWorkController {
  constructor(private readonly rpService: RpService) {}

  getView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerData } = req
    const { token } = req.user
    const crsReferrals = await this.rpService.getCrsReferrals(
      token,
      req.sessionID,
      prisonerData.personalDetails.prisonerNumber as string,
      'EDUCATION_SKILLS_AND_WORK',
    )

    const view = new EducationSkillsWorkView(prisonerData, crsReferrals)
    res.render('pages/education-skills-work', { ...view.renderArgs })
  }
}

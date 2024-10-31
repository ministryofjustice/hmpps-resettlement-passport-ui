import { RequestHandler } from 'express'
import RpService from '../../services/rpService'
import AssessmentCompleteView from './assessmentCompleteView'
import { AssessmentType } from '../../data/model/assessmentInformation'
import { parseAssessmentType } from '../../utils/utils'
import { AssessmentStateService } from '../../data/assessmentStateService'
import { PATHWAY_DICTIONARY } from '../../utils/constants'

export default class AssessmentCompleteController {
  constructor(private readonly rpService: RpService, private readonly assessmentStateService: AssessmentStateService) {
    // no op
  }

  getView: RequestHandler = (req, res, next) => {
    const { prisonerData } = req
    if (!prisonerData) {
      return next(new Error('Prisoner number is missing from request'))
    }

    const assessmentType = parseAssessmentType(req.query.type)
    const view = new AssessmentCompleteView(prisonerData, assessmentType)
    return res.render('pages/assessment-complete', { ...view.renderArgs })
  }

  postView: RequestHandler = async (req, res, next) => {
    try {
      const { prisonerData } = req
      if (!prisonerData) {
        return next(new Error('Prisoner number is missing from request'))
      }

      const assessmentType: AssessmentType = parseAssessmentType(req.body.assessmentType)
      const prisonerNumber = prisonerData.personalDetails.prisonerNumber as string
      const response = await this.rpService.submitAssessment(prisonerNumber, assessmentType)
      if (response.error) {
        return next(new Error('Error returned from Resettlement Passport API'))
      }
      // Clear cache on submitted for all pathways to avoid side effects on the next report
      const promises = Object.entries(PATHWAY_DICTIONARY).map(([pathway]) => {
        const stateKey = {
          prisonerNumber: prisonerData.personalDetails.prisonerNumber,
          userId: req.user.username,
          pathway,
          assessmentType,
        }
        return this.assessmentStateService.onComplete(stateKey)
      })
      await Promise.all(promises)
      return res.redirect(`/assessment-complete?prisonerNumber=${prisonerNumber}&type=${assessmentType}`)
    } catch (err) {
      return next(err)
    }
  }
}

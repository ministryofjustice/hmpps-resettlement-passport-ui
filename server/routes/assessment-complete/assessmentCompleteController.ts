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

  getView: RequestHandler = (req, res, _) => {
    const { prisonerData } = req
    const assessmentType = parseAssessmentType(req.query.type)
    const view = new AssessmentCompleteView(prisonerData, assessmentType)
    res.render('pages/assessment-complete', { ...view.renderArgs })
  }

  postView: RequestHandler = async (req, res, next) => {
    try {
      const { prisonerData } = req
      const assessmentType: AssessmentType = parseAssessmentType(req.body.assessmentType)
      const prisonerNumber = prisonerData.personalDetails.prisonerNumber as string
      const response = await this.rpService.submitAssessment(prisonerNumber, assessmentType)
      if (response.error) {
        next(new Error())
      } else {
        // Clear cache on submitted for all pathways to avoid side effects on the next report
        const promises = Object.entries(PATHWAY_DICTIONARY).map(([pathway]) => {
          const stateKey = {
            prisonerNumber: prisonerData.personalDetails.prisonerNumber,
            userId: req.user.username,
            assessmentType,
            pathway,
          }
          return this.assessmentStateService.onComplete(stateKey)
        })
        await Promise.all(promises)
        res.redirect(`/assessment-complete?prisonerNumber=${prisonerNumber}&type=${assessmentType}`)
      }
    } catch (err) {
      next(err)
    }
  }
}

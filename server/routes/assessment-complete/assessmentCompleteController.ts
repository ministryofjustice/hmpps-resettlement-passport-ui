import { RequestHandler } from 'express'
import NodeClient from 'applicationinsights/out/Library/NodeClient'
import RpService from '../../services/rpService'
import AssessmentCompleteView from './assessmentCompleteView'
import { AssessmentType } from '../../data/model/assessmentInformation'
import { parseAssessmentType } from '../../utils/utils'
import { AssessmentStateService } from '../../data/assessmentStateService'
import { PATHWAY_DICTIONARY } from '../../utils/constants'
import { PsfrEvent, trackEvent } from '../../utils/analytics'
import { PathwayStatus } from '../../@types/express'
import PrisonerDetailsService from '../../services/prisonerDetailsService'

export default class AssessmentCompleteController {
  constructor(
    private readonly rpService: RpService,
    private readonly assessmentStateService: AssessmentStateService,
    private readonly appInsightsClient: NodeClient,
    private readonly prisonerDetailsService: PrisonerDetailsService,
  ) {
    // no op
  }

  getView: RequestHandler = async (req, res, next) => {
    const prisonerData = await this.prisonerDetailsService.loadPrisonerDetailsFromParam(req, res)
    const assessmentType = parseAssessmentType(req.query.type)
    const view = new AssessmentCompleteView(prisonerData, assessmentType)
    return res.render('pages/assessment-complete', { ...view.renderArgs })
  }

  postView: RequestHandler = async (req, res, next) => {
    try {
      const prisonerData = await this.prisonerDetailsService.loadPrisonerDetailsFromBody(req, res)
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

      await this.sendEvent(prisonerNumber, req.sessionID, res.locals.user.username, prisonerData.pathways)

      return res.redirect(`/assessment-complete?prisonerNumber=${prisonerNumber}&type=${assessmentType}`)
    } catch (err) {
      return next(err)
    }
  }

  private async sendEvent(
    prisonerNumber: string,
    sessionId: string,
    username: string,
    oldPathwayStatus: PathwayStatus[],
  ) {
    const prisonerData = await this.rpService.getPrisonerDetails(prisonerNumber)
    const newPathwayStatus = prisonerData.pathways

    Object.entries(PATHWAY_DICTIONARY).forEach(([pathway]) => {
      trackEvent(this.appInsightsClient, PsfrEvent.REPORT_SUBMITTED_EVENT, {
        prisonerId: prisonerNumber,
        sessionId,
        username,
        pathway,
        oldStatus: oldPathwayStatus.find(it => it.pathway === pathway)?.status,
        newStatus: newPathwayStatus.find(it => it.pathway === pathway)?.status,
      })
    })
  }
}

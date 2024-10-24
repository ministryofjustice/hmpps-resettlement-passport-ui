import { RequestHandler } from 'express'
import NodeClient from 'applicationinsights/out/Library/NodeClient'
import { getEnumByURL, getEnumValue, isValidPathway, isValidStatus } from '../../utils/utils'
import logger from '../../../logger'
import { PsfrEvent, trackEvent } from '../../utils/analytics'
import RpService from '../../services/rpService'
import StatusUpdateView from './statusUpdateView'

export default class StatusUpdateController {
  constructor(private readonly rpService: RpService, private readonly appInsightsClient: NodeClient) {
    // no op
  }

  getStatusUpdate: RequestHandler = (req, res, next) => {
    const { prisonerData } = req
    const selectedPathway = req.query.selectedPathway as string
    const validationError = req.flash('validationError')?.[0]

    if (!prisonerData) {
      return next(new Error('Prisoner number is missing from request'))
    }

    if (!selectedPathway || !isValidPathway(selectedPathway)) {
      return next(new Error('No valid pathway specified in request'))
    }

    const statusUpdateView = new StatusUpdateView(prisonerData, selectedPathway, validationError)

    return res.render('pages/status-update', { ...statusUpdateView.renderArgs })
  }

  postStatusUpdate: RequestHandler = async (req, res, next) => {
    try {
      const { prisonerData } = req
      if (!prisonerData) {
        return next(new Error('Prisoner number is missing from request'))
      }
      const { prisonerNumber } = prisonerData.personalDetails

      const { selectedStatus, selectedPathway } = req.body
      const caseNoteInput = req.body[`caseNoteInput_${selectedStatus}`] || null

      if (!selectedPathway || !isValidPathway(selectedPathway)) {
        return next(new Error('No valid pathway specified in request'))
      }

      if (!selectedStatus) {
        req.flash('validationError', 'Select a new status')
        return res.redirect(`/status-update?prisonerNumber=${prisonerNumber}&selectedPathway=${selectedPathway}`)
      }

      if (!isValidStatus(selectedStatus)) {
        return next(new Error('No valid status specified in request'))
      }

      const status = getEnumValue(selectedStatus).name
      const pathway = getEnumByURL(selectedPathway)
      await this.rpService.patchStatusWithCaseNote(prisonerNumber, {
        pathway,
        status: selectedStatus,
        caseNoteText: `Resettlement status set to: ${status}. ${caseNoteInput || ''}`,
      })
      trackEvent(this.appInsightsClient, PsfrEvent.STATUS_UPDATE_EVENT, {
        prisonerId: prisonerNumber,
        sessionId: req.sessionID,
        username: res.locals.user.username,
        pathway,
        oldStatus: prisonerData.pathways.find(it => it.pathway === pathway)?.status,
        newStatus: selectedStatus,
      })
      return res.redirect(`/${selectedPathway}?prisonerNumber=${prisonerNumber}#case-notes`)
    } catch (err) {
      logger.warn(err, 'Failed to set status')
      return next(new Error('Failed to set status'))
    }
  }
}

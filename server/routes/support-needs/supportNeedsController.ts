import { RequestHandler } from 'express'
import { ErrorMessage } from '../view'
import { getFeatureFlagBoolean } from '../../utils/utils'
import { FEATURE_FLAGS, PATHWAY_DICTIONARY } from '../../utils/constants'
import SupportNeedsView from './supportNeedsView'
import { SupportNeedStateService } from '../../data/supportNeedStateService'
import PrisonerDetailsService from '../../services/prisonerDetailsService'

export default class SupportNeedsController {
  constructor(
    private readonly supportNeedStateService: SupportNeedStateService,
    private readonly prisonerDetailsService: PrisonerDetailsService,
  ) {
    // no op
  }

  resetSupportNeedsCache: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const { pathway } = req.params
      validatePathwaySupportNeeds(pathway)
      try {
        const prisonerData = await this.prisonerDetailsService.loadPrisonerDetailsFromParam(req, res, false)
        const { prisonerNumber } = prisonerData.personalDetails
        const stateKey = {
          prisonerNumber,
          userId: req.user.username,
          pathway,
        }
        await this.supportNeedStateService.deleteSupportNeeds(stateKey)
        res.redirect(`/support-needs/${pathway}/?prisonerNumber=${prisonerNumber}`)
      } catch (err) {
        next(err)
      }
    } catch (err) {
      next(err)
    }
  }

  getSupportNeeds: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      validatePathwaySupportNeeds(req.params.pathway)
      const errors: ErrorMessage[] = []
      try {
        const view = new SupportNeedsView(errors)
        res.render('pages/support-needs', { ...view.renderArgs })
      } catch (err) {
        next(err)
      }
    } catch (err) {
      next(err)
    }
  }

  submitSupportNeeds: RequestHandler = async (req, res, next): Promise<void> => {
    const errors: ErrorMessage[] = []
    const view = new SupportNeedsView(errors)
    res.render('pages/support-needs-status', { ...view.renderArgs })
  }

  getSupportNeedsStatus: RequestHandler = async (req, res, next): Promise<void> => {
    const errors: ErrorMessage[] = []
    const view = new SupportNeedsView(errors)
    res.render('pages/support-needs-status', { ...view.renderArgs })
  }

  submitSupportNeedsStatus: RequestHandler = async (req, res, next): Promise<void> => {
    const errors: ErrorMessage[] = []
    const view = new SupportNeedsView(errors)
    res.render('pages/support-needs-check-answers', { ...view.renderArgs })
  }

  finaliseSupportNeeds: RequestHandler = async (req, res, next): Promise<void> => {
    const { pathway } = req.params
    const prisonerData = await this.prisonerDetailsService.loadPrisonerDetailsFromParam(req, res, false)
    const { prisonerNumber } = prisonerData.personalDetails

    res.redirect(`/${pathway}/?prisonerNumber=${prisonerNumber}`)
  }
}

async function validatePathwaySupportNeeds(pathway: string) {
  const supportNeedsEnabled = await getFeatureFlagBoolean(FEATURE_FLAGS.SUPPORT_NEEDS)
  const pathwayExists = Object.values(PATHWAY_DICTIONARY).some(p => p.url === pathway)

  if (!pathwayExists) {
    throw new Error('Pathway not found')
  }

  if (!supportNeedsEnabled) {
    throw new Error('Page unavailable')
  }
}

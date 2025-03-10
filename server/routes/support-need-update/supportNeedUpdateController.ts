import { RequestHandler } from 'express'
import { validationResult } from 'express-validator'
import PrisonerDetailsService from '../../services/prisonerDetailsService'
import {
  getNameFromUrl,
  processSupportNeedsRequestBody,
  validatePathwaySupportNeeds,
  validateStringIsAnInteger,
} from '../../utils/utils'
import RpService from '../../services/rpService'
import SupportNeedUpdateView from './supportNeedUpdateView'

export default class SupportNeedUpdateController {
  constructor(private readonly prisonerDetailsService: PrisonerDetailsService, private readonly rpService: RpService) {
    // no op
  }

  getSupportNeedUpdateForm: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const { pathway, prisonerNeedId } = req.params

      await validatePathwaySupportNeeds(pathway)
      const pathwayName = getNameFromUrl(pathway)
      validateStringIsAnInteger(prisonerNeedId)

      const prisonerData = await this.prisonerDetailsService.loadPrisonerDetailsFromParam(req, res, false)
      const { prisonerNumber } = prisonerData.personalDetails

      const existingPrisonerNeed = await this.rpService.getPrisonerNeedById(prisonerNumber, prisonerNeedId)

      const supportNeedUpdateView = new SupportNeedUpdateView(
        prisonerData,
        existingPrisonerNeed,
        pathwayName,
        prisonerNeedId,
        req.config.supportNeeds.releaseDate,
      )

      const errors = req.flash('errors')
      const formValues = req.flash('formValues')?.[0] || {}
      const updateStatus = existingPrisonerNeed.status
      const responsibleStaff = [
        existingPrisonerNeed.isPrisonResponsible ? 'PRISON' : null,
        existingPrisonerNeed.isProbationResponsible ? 'PROBATION' : null,
      ].filter(x => x !== null)

      res.render('pages/update-support-need', {
        ...supportNeedUpdateView.renderArgs,
        updateStatus,
        responsibleStaff,
        ...formValues,
        errors,
      })
    } catch (err) {
      next(err)
    }
  }

  postSupportNeedUpdateForm: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const { pathway, prisonerNeedId } = req.params

      await validatePathwaySupportNeeds(pathway)
      validateStringIsAnInteger(prisonerNeedId)
      const errors = validationResult(req)

      const prisonerData = await this.prisonerDetailsService.loadPrisonerDetailsFromBody(req, res, false)
      const { prisonerNumber } = prisonerData.personalDetails

      if (!errors.isEmpty()) {
        req.flash('errors', errors.array())
        req.flash('formValues', req.body)
        res.redirect(`/support-needs/${pathway}/update/${prisonerNeedId}?prisonerNumber=${prisonerNumber}`)
      } else {
        const supportNeedsPatch = processSupportNeedsRequestBody(req.body)
        await this.rpService.patchSupportNeedById(prisonerNumber, prisonerNeedId, supportNeedsPatch)

        res.redirect(`/${pathway}?prisonerNumber=${prisonerNumber}#support-needs-updates`)
      }
    } catch (err) {
      next(err)
    }
  }
}

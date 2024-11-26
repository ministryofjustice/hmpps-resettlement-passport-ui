import { RequestHandler } from 'express'
import { isNumeric } from 'validator'
import RpService from '../../services/rpService'
import PrisonerDetailsService from '../../services/prisonerDetailsService'
import { badRequestError } from '../../errorHandler'

export default class LicenceImageController {
  constructor(private readonly rpService: RpService, private readonly prisonerDetailsService: PrisonerDetailsService) {
    // no op
  }

  getView: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const prisonerData = await this.prisonerDetailsService.loadPrisonerDetailsFromParam(req, res, true)
      const licenceId = req.query.licenceId as string
      const conditionId = req.query.conditionId as string

      if (!licenceId || !isNumeric(licenceId)) {
        return next(badRequestError('missing or invalid licenceId'))
      }
      if (!conditionId || !isNumeric(conditionId)) {
        return next(badRequestError('missing or invalid conditionId'))
      }

      const imageBase64 = await this.rpService.getLicenceConditionImage(
        prisonerData.personalDetails.prisonerNumber,
        licenceId,
        conditionId,
      )

      return res.render('pages/licence-image', { imageBase64, prisonerData })
    } catch (err) {
      return next(err)
    }
  }
}

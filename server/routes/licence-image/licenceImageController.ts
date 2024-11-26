import { RequestHandler } from 'express'
import RpService from '../../services/rpService'
import PrisonerDetailsService from '../../services/prisonerDetailsService'

export default class LicenceImageController {
  constructor(private readonly rpService: RpService, private readonly prisonerDetailsService: PrisonerDetailsService) {
    // no op
  }

  getView: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const prisonerData = await this.prisonerDetailsService.loadPrisonerDetailsFromParam(req, res, true)
      const licenceId = req.query.licenceId as string
      const conditionId = req.query.conditionId as string
      const imageBase64 = await this.rpService.getLicenceConditionImage(
        prisonerData.personalDetails.prisonerNumber,
        licenceId,
        conditionId,
      )

      res.render('pages/licence-image', { imageBase64, prisonerData })
    } catch (err) {
      next(err)
    }
  }
}

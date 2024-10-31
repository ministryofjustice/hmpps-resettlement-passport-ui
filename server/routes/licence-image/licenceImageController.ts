import { RequestHandler } from 'express'
import RpService from '../../services/rpService'

export default class LicenceImageController {
  constructor(private readonly rpService: RpService) {
    // no op
  }

  getView: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const { prisonerData } = req
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

import express, { Request } from 'express'
import { RPClient } from '../../data'
import logger from '../../../logger'

const licenceImageRouter = express.Router().get('/', async (req: Request, res, next) => {
  const { prisonerData } = req
  const { licenceId, conditionId } = req.query
  try {
    const apiResponse = new RPClient()
    const imageBase64 = await apiResponse.getImageAsBase64String(
      req.user.token,
      `/resettlement-passport/prisoner/${prisonerData.personalDetails.prisonerNumber}/licence-condition/id/${licenceId}/condition/${conditionId}/image`,
    )

    res.render('pages/licence-image', { imageBase64, prisonerData })
  } catch (error) {
    const errorMessage = error.message
    logger.error('Error fetching licence condition image:', error)
    res.render('pages/licence-image', { errorMessage, prisonerData })
  }
})

export default licenceImageRouter

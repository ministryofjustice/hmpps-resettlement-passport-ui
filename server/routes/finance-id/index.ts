import express, { Request } from 'express'
import { RPClient } from '../../data'
import logger from '../../../logger'

const financeIdRouter = express.Router().get('/', async (req: Request, res, next) => {
  const { prisonerData } = req

  try {
    const apiResponse = new RPClient()
    const assessment = await apiResponse.get(
      req.user.token,
      `/resettlement-passport/prisoner/${prisonerData.personalDetails.prisonerNumber}/assessment`,
    )
    res.render('pages/finance-id', { assessment, prisonerData })
  } catch (error) {
    const errorMessage = error.message
    logger.error('Error fetching assessment:', error)
    res.render('pages/finance-id', { errorMessage, prisonerData })
  }
})

export default financeIdRouter

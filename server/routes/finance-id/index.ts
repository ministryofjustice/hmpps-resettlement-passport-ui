import express, { Request } from 'express'
import { RPClient } from '../../data'
import logger from '../../../logger'

const financeIdRouter = express.Router().get('/', async (req: Request, res, next) => {
  const { prisonerData } = req
  const { deleteConfirmed, assessmentId } = req.query

  if (deleteConfirmed) {
    try {
      const apiResponse = new RPClient()
      await apiResponse.delete(
        req.user.token,
        `/resettlement-passport/prisoner/${prisonerData.personalDetails.prisonerNumber}/assessment/${assessmentId}`,
      )
      getAssessment()
    } catch (error) {
      const errorMessage = error.message
      logger.error('Error deleting assessment:', error)

      res.render('pages/finance-id', { errorMessage, prisonerData })
    }
    return
  }
  getAssessment()
  async function getAssessment() {
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
  }
})

export default financeIdRouter

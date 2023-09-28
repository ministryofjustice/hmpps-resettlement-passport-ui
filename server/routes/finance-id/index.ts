import express, { Request } from 'express'
import { RPClient } from '../../data'
import logger from '../../../logger'

const financeIdRouter = express.Router().get('/', async (req: Request, res, next) => {
  const { prisonerData } = req
  const { deleteAssessmentConfirmed, assessmentId, deleteFinanceConfirmed, financeId } = req.query

  const apiResponse = new RPClient()

  let assessment: { error?: boolean } = {}
  let assessmentDeleted: { error?: boolean } = {}
  let finance: { error?: boolean } = {}
  let financeDeleted: { error?: boolean } = {}

  // DELETE ASSESSMENT
  if (deleteAssessmentConfirmed) {
    try {
      assessmentDeleted = await apiResponse.delete(
        req.user.token,
        `/resettlement-passport/prisoner/${prisonerData.personalDetails.prisonerNumber}/assessment/${assessmentId}`,
      )
    } catch (err) {
      logger.warn(`Error deleting assessment`, err)
      assessmentDeleted.error = true
    }
  }
  // FETCH ASSESSMENT
  try {
    assessment = await apiResponse.get(
      req.user.token,
      `/resettlement-passport/prisoner/${prisonerData.personalDetails.prisonerNumber}/assessment`,
    )
  } catch (err) {
    logger.warn(`Error fetching assessment data`, err)
    assessment.error = true
  }
  // DELETE FINANCE
  if (deleteFinanceConfirmed) {
    try {
      financeDeleted = await apiResponse.delete(
        req.user.token,
        `/resettlement-passport/prisoner/${prisonerData.personalDetails.prisonerNumber}/bankapplication/${financeId}`,
      )
    } catch (err) {
      logger.warn(`Error deleting finance`, err)
      financeDeleted.error = true
    }
  }
  // FETCH FINANCE
  try {
    finance = await apiResponse.get(
      req.user.token,
      `/resettlement-passport/prisoner/${prisonerData.personalDetails.prisonerNumber}/bankapplication`,
    )
    console.log(finance)
  } catch (err) {
    logger.warn(`Error fetching finance data`, err)
    finance.error = true
  }

  res.render('pages/finance-id', { assessment, prisonerData, finance })
})

export default financeIdRouter

import express, { Request } from 'express'
// import { RPClient } from '../../data'
// import logger from '../../../logger'

const confirmAssessmentRouter = express.Router().get('/', async (req: Request, res, next) => {
  const { prisonerData } = req
  const params = req.query
  res.render('pages/assessment-confirmation', { prisonerData, params, req })
})

export default confirmAssessmentRouter

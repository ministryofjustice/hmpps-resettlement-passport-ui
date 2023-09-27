import express, { Request } from 'express'
// import { RPClient } from '../../data'
// import logger from '../../../logger'

const confirmAssessmentRouter = express.Router().get('/', async (req: Request, res, next) => {
  const { prisonerData } = req
  const params = req.query
  const errorMsg: { idRequired: null | string } = { idRequired: null }
  const { assessmentDate, isIdRequired, isBankAccountRequired } = params

  console.log(params)

  if (!isIdRequired) {
    console.log('NO ID')
    errorMsg.idRequired = 'Please choose if ID is required'
    res.render('pages/assessment', { prisonerData, params, req, errorMsg })
    return
  }
  res.render('pages/assessment-confirmation', { prisonerData, params, req })
})

export default confirmAssessmentRouter

import express, { Request } from 'express'
// import { RPClient } from '../../data'
// import logger from '../../../logger'

const confirmAssessmentRouter = express.Router().get('/', async (req: Request, res, next) => {
  const { prisonerData } = req
  const params = req.query
  let errorMsg: { idRequired: null | string; bankAccountRequired: null | string } = {
    idRequired: null,
    bankAccountRequired: null,
  }
  const { assessmentDate, isIdRequired, isBankAccountRequired } = params

  if (!isIdRequired || !isBankAccountRequired) {
    const message = 'Select an option'
    errorMsg = {
      idRequired: isIdRequired ? null : message,
      bankAccountRequired: isBankAccountRequired ? null : message,
    }
    res.render('pages/assessment', { prisonerData, params, req, errorMsg })
    return
  }
  res.render('pages/assessment-confirmation', { prisonerData, params, req })
})

export default confirmAssessmentRouter

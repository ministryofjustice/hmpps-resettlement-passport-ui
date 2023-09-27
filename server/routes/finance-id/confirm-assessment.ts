import express, { Request } from 'express'
// import { RPClient } from '../../data'
// import logger from '../../../logger'
type ErrorMessage = {
  idRequired: null | string
  bankAccountRequired: null | string
  dateAssessmentDay: null | string
  dateAssessmentMonth: null | string
  dateAssessmentYear: null | string
}
const confirmAssessmentRouter = express.Router().get('/', async (req: Request, res, next) => {
  const { prisonerData } = req
  const params = req.query
  let errorMsg: ErrorMessage = {
    idRequired: null,
    bankAccountRequired: null,
    dateAssessmentDay: null,
    dateAssessmentMonth: null,
    dateAssessmentYear: null,
  }

  const {
    assessmentDate,
    isIdRequired,
    isBankAccountRequired,
    dateAssessmentDay,
    dateAssessmentMonth,
    dateAssessmentYear,
  } = params
  console.log(assessmentDate)
  if (!isIdRequired || !isBankAccountRequired || !dateAssessmentDay || !dateAssessmentMonth || !dateAssessmentYear) {
    const message = 'Select an option'
    const dateFieldMissingMessage = 'The date of assessment must include a '
    errorMsg = {
      idRequired: isIdRequired ? null : message,
      bankAccountRequired: isBankAccountRequired ? null : message,
      dateAssessmentDay: dateAssessmentDay ? null : `${dateFieldMissingMessage} day`,
      dateAssessmentMonth: dateAssessmentMonth ? null : `${dateFieldMissingMessage} month`,
      dateAssessmentYear: dateAssessmentYear ? null : `${dateFieldMissingMessage} year`,
    }
    res.render('pages/assessment', { prisonerData, params, req, errorMsg })
    return
  }
  res.render('pages/assessment-confirmation', { prisonerData, params, req })
})

export default confirmAssessmentRouter

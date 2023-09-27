import express, { Request } from 'express'
// import { RPClient } from '../../data'
// import logger from '../../../logger'
type ErrorMessage = {
  idRequired: null | string
  bankAccountRequired: null | string
  dateAssessmentDay: null | string
  dateAssessmentMonth: null | string
  dateAssessmentYear: null | string
  futureDate: null | string
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
    futureDate: null,
  }

  const { isIdRequired, isBankAccountRequired, dateAssessmentDay, dateAssessmentMonth, dateAssessmentYear } = params

  function isDateInFuture(inputDay: string, inputMonth: string, inputYear: string) {
    // Create a Date object using the input values
    const currentDate = new Date()
    const inputDate = new Date(Number(inputYear), Number(inputMonth) - 1, Number(inputDay)) // Month is zero-based

    // Check if the input date is in the future
    return inputDate > currentDate
  }

  const isFutureDate = isDateInFuture(
    <string>dateAssessmentDay,
    <string>dateAssessmentMonth,
    <string>dateAssessmentYear,
  )

  if (
    !isIdRequired ||
    !isBankAccountRequired ||
    !dateAssessmentDay ||
    !dateAssessmentMonth ||
    !dateAssessmentYear ||
    isFutureDate
  ) {
    const message = 'Select an option'
    const dateFieldMissingMessage = 'The date of assessment must include a '
    errorMsg = {
      idRequired: isIdRequired ? null : message,
      bankAccountRequired: isBankAccountRequired ? null : message,
      dateAssessmentDay: dateAssessmentDay ? null : `${dateFieldMissingMessage} day`,
      dateAssessmentMonth: dateAssessmentMonth ? null : `${dateFieldMissingMessage} month`,
      dateAssessmentYear: dateAssessmentYear ? null : `${dateFieldMissingMessage} year`,
      futureDate: isFutureDate ? 'The date of assessment must be in the past' : null,
    }
    res.render('pages/assessment', { prisonerData, params, req, errorMsg })
    return
  }
  res.render('pages/assessment-confirmation', { prisonerData, params, req })
})

export default confirmAssessmentRouter

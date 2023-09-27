import express, { Request } from 'express'
import { formatDate } from '../../utils/utils'
// import { RPClient } from '../../data'
// import logger from '../../../logger'
type ErrorMessage = {
  idRequired: null | string
  bankAccountRequired: null | string
  dateAssessmentDay: null | string
  dateAssessmentMonth: null | string
  dateAssessmentYear: null | string
  futureDate: null | string
  isValidDate: null | string
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
    isValidDate: null,
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
  function isDateValid(dateString: string): boolean {
    const pattern = /^\d{4}-\d{2}-\d{2}$/
    if (!pattern.test(dateString)) {
      return false // Invalid format
    }
    const parts = dateString.split('-')
    const year = parseInt(parts[0], 10)
    const month = parseInt(parts[1], 10)
    const day = parseInt(parts[2], 10)

    const date = new Date(year, month - 1, day)
    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
  }
  const isValidDate = isDateValid(`${dateAssessmentYear}-${dateAssessmentMonth}-${dateAssessmentDay}`)

  if (
    !isIdRequired ||
    !isBankAccountRequired ||
    !dateAssessmentDay ||
    !dateAssessmentMonth ||
    !dateAssessmentYear ||
    isFutureDate ||
    !isValidDate
  ) {
    const message = 'Select an option'
    const dateFieldMissingMessage = 'The date of assessment must include a '
    const dateFieldInvalid = 'The date of assessment must be a real date'
    errorMsg = {
      idRequired: isIdRequired ? null : message,
      bankAccountRequired: isBankAccountRequired ? null : message,
      dateAssessmentDay: dateAssessmentDay ? null : `${dateFieldMissingMessage} day`,
      dateAssessmentMonth: dateAssessmentMonth ? null : `${dateFieldMissingMessage} month`,
      dateAssessmentYear: dateAssessmentYear ? null : `${dateFieldMissingMessage} year`,
      futureDate: isFutureDate ? 'The date of assessment must be in the past' : null,
      isValidDate: isValidDate ? null : dateFieldInvalid,
    }
    res.render('pages/assessment', { prisonerData, params, req, errorMsg })
    return
  }
  res.render('pages/assessment-confirmation', { prisonerData, params, req })
})

export default confirmAssessmentRouter

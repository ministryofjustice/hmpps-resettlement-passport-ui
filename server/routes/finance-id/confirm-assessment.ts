import express, { Request } from 'express'

type ErrorMessage = {
  idRequired: null | string
  bankAccountRequired: null | string
  dateAssessmentDay: null | string
  dateAssessmentMonth: null | string
  dateAssessmentYear: null | string
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
    isValidDate: null,
  }

  const { isIdRequired, isBankAccountRequired, dateAssessmentDay, dateAssessmentMonth, dateAssessmentYear } = params

  function isDateValid(dateString: string): boolean {
    const pattern = /^\d{4}-\d{1,2}-\d{1,2}$/
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
      isValidDate: isValidDate ? null : dateFieldInvalid,
    }
    res.render('pages/assessment', { prisonerData, params, req, errorMsg })
    return
  }

  res.render('pages/assessment-confirmation', { prisonerData, params, req })
})

export default confirmAssessmentRouter

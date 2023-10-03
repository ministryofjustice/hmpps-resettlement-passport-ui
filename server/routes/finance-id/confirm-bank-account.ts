import express from 'express'

type ErrorMessage = {
  applicationSubmittedDay: null | string
  applicationSubmittedMonth: null | string
  applicationSubmittedYear: null | string
  futureDate: null | string
  isValidDate: null | string
  noBankName: null | string
}

const confirmBankAccountRouter = express.Router().get('/', async (req, res, next) => {
  const { prisonerData } = req
  const params = req.query

  let errorMsg: ErrorMessage = {
    applicationSubmittedDay: null,
    applicationSubmittedMonth: null,
    applicationSubmittedYear: null,
    noBankName: null,
    futureDate: null,
    isValidDate: null,
  }

  const { applicationSubmittedDay, applicationSubmittedMonth, applicationSubmittedYear, bankName } = params

  function isDateInFuture(inputDay: string, inputMonth: string, inputYear: string) {
    // Create a Date object using the input values
    const currentDate = new Date()
    const inputDate = new Date(Number(inputYear), Number(inputMonth) - 1, Number(inputDay)) // Month is zero-based

    // Check if the input date is in the future
    return inputDate > currentDate
  }

  const isFutureDate = isDateInFuture(
    <string>applicationSubmittedDay,
    <string>applicationSubmittedMonth,
    <string>applicationSubmittedYear,
  )

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
  const isValidDate = isDateValid(`${applicationSubmittedDay}-${applicationSubmittedMonth}-${applicationSubmittedYear}`)

  if (
    !applicationSubmittedDay ||
    !applicationSubmittedMonth ||
    !applicationSubmittedYear ||
    isFutureDate ||
    !bankName ||
    !isValidDate
  ) {
    const dateFieldMissingMessage = 'The date of application must include a '
    const dateFieldInvalid = 'The date of application must be a real date'
    const noBankNameErrorMsg = 'The application must include a bank name'
    errorMsg = {
      applicationSubmittedDay: applicationSubmittedDay ? null : `${dateFieldMissingMessage} day`,
      applicationSubmittedMonth: applicationSubmittedMonth ? null : `${dateFieldMissingMessage} month`,
      applicationSubmittedYear: applicationSubmittedYear ? null : `${dateFieldMissingMessage} year`,
      futureDate: isFutureDate ? 'The date of application must be in the past' : null,
      isValidDate: isValidDate ? null : dateFieldInvalid,
      noBankName: bankName ? null : noBankNameErrorMsg,
    }
    res.render('pages/add-bank-account', { prisonerData, params, req, errorMsg })
    return
  }
  res.render('pages/add-bank-account-confirm', { prisonerData, params, req })
})

export default confirmBankAccountRouter

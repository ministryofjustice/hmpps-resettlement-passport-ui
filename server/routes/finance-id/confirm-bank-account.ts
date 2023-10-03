import express from 'express'

type ErrorMessage = {
  applicationSubmittedDay?: null | string
  applicationSubmittedMonth?: null | string
  applicationSubmittedYear?: null | string
  futureDate?: null | string
  resubmittedFutureDate?: null | string
  resubmittedHeardFutureDate?: null | string
  isValidDate?: null | string
  noBankName?: null | string
  noStatus?: null | string
  dateResubmittedHeardDay?: null | string
  dateResubmittedHeardMonth?: null | string
  dateResubmittedHeardYear?: null | string
  applicationResubmittedDay?: null | string
  applicationResubmittedMonth?: null | string
  applicationResubmittedYear?: null | string
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
    resubmittedFutureDate: null,
    resubmittedHeardFutureDate: null,
    isValidDate: null,
    noStatus: null,
    applicationResubmittedDay: null,
    applicationResubmittedMonth: null,
    applicationResubmittedYear: null,
    dateResubmittedHeardDay: null,
    dateResubmittedHeardMonth: null,
    dateResubmittedHeardYear: null,
  }

  const {
    applicationSubmittedDay,
    applicationSubmittedMonth,
    applicationSubmittedYear,
    bankName,
    confirmationType,
    applicationType,
    status,
    dateResubmittedHeardDay,
    dateResubmittedHeardMonth,
    dateResubmittedHeardYear,
    applicationResubmittedDay,
    applicationResubmittedMonth,
    applicationResubmittedYear,
  } = params

  const dateFieldMissingMessage = 'The date must include a'
  const dateFieldInvalid = 'The date must be a real date'
  const missingInput = 'The application must include a'

  function isDateInFuture(inputDay: string, inputMonth: string, inputYear: string) {
    // Create a Date object using the input values
    const currentDate = new Date()
    const inputDate = new Date(Number(inputYear), Number(inputMonth) - 1, Number(inputDay)) // Month is zero-based

    // Check if the input date is in the future
    return inputDate > currentDate
  }

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

  function validateNewAccount() {
    const isValidDate = isDateValid(
      `${applicationSubmittedYear}-${applicationSubmittedMonth}-${applicationSubmittedDay}`,
    )
    const isFutureDate = isDateInFuture(
      <string>applicationSubmittedDay,
      <string>applicationSubmittedMonth,
      <string>applicationSubmittedYear,
    )
    if (
      !applicationSubmittedDay ||
      !applicationSubmittedMonth ||
      !applicationSubmittedYear ||
      isFutureDate ||
      !bankName ||
      !isValidDate
    ) {
      errorMsg = {
        applicationSubmittedDay: applicationSubmittedDay ? null : `${dateFieldMissingMessage} day`,
        applicationSubmittedMonth: applicationSubmittedMonth ? null : `${dateFieldMissingMessage} month`,
        applicationSubmittedYear: applicationSubmittedYear ? null : `${dateFieldMissingMessage} year`,
        futureDate: isFutureDate ? 'The date of application must be in the past' : null,
        isValidDate: isValidDate ? null : dateFieldInvalid,
        noBankName: bankName ? null : `${missingInput} bank name`,
      }
      res.render('pages/add-bank-account', { prisonerData, params, req, errorMsg })
    } else {
      res.render('pages/add-bank-account-confirm', { prisonerData, params, req })
    }
  }

  function validateResubmit() {
    let pageContainsError = false
    const isValidDate = isDateValid(
      `${dateResubmittedHeardYear}-${dateResubmittedHeardMonth}-${dateResubmittedHeardDay}`,
    )
    const isResubmittedHeardBackFutureDate = isDateInFuture(
      <string>dateResubmittedHeardDay,
      <string>dateResubmittedHeardMonth,
      <string>dateResubmittedHeardYear,
    )
    const isResubmittedFutureDate = isDateInFuture(
      <string>applicationResubmittedDay,
      <string>applicationResubmittedMonth,
      <string>applicationResubmittedYear,
    )

    if (
      !applicationResubmittedDay ||
      !applicationResubmittedMonth ||
      !applicationResubmittedYear ||
      isResubmittedFutureDate
    ) {
      pageContainsError = true
      errorMsg.applicationResubmittedDay = applicationResubmittedDay ? null : `${dateFieldMissingMessage} day`
      errorMsg.applicationResubmittedMonth = applicationResubmittedMonth ? null : `${dateFieldMissingMessage} month`
      errorMsg.applicationResubmittedYear = applicationResubmittedYear ? null : `${dateFieldMissingMessage} year`
      errorMsg.resubmittedFutureDate = isResubmittedFutureDate ? 'The date of must be in the past' : null
    }

    if (!status) {
      pageContainsError = true
      errorMsg.noStatus = status ? null : `${missingInput} status`
    }

    if (
      status === 'Account declined' &&
      (!dateResubmittedHeardDay ||
        !dateResubmittedHeardMonth ||
        !dateResubmittedHeardYear ||
        isResubmittedHeardBackFutureDate ||
        !isValidDate)
    ) {
      pageContainsError = true
      errorMsg.dateResubmittedHeardDay = dateResubmittedHeardDay ? null : `${dateFieldMissingMessage} day`
      errorMsg.dateResubmittedHeardMonth = dateResubmittedHeardMonth ? null : `${dateFieldMissingMessage} month`
      errorMsg.dateResubmittedHeardYear = dateResubmittedHeardYear ? null : `${dateFieldMissingMessage} year`
      errorMsg.resubmittedHeardFutureDate = isResubmittedHeardBackFutureDate ? 'The date of must be in the past' : null
      errorMsg.isValidDate = isValidDate ? null : dateFieldInvalid
    }

    if (pageContainsError) {
      res.render('pages/add-bank-account', { prisonerData, params, req, errorMsg })
    } else {
      res.render('pages/add-bank-account-confirm', { prisonerData, params, req })
    }
  }

  if (confirmationType === 'addAccount') {
    validateNewAccount()
  }
  if (confirmationType === 'resubmit' || applicationType === 'resubmit') {
    validateResubmit()
  }
  if (confirmationType === 'updateStatus') {
    res.render('pages/add-bank-account-confirm', { prisonerData, params, req })
  }
})

export default confirmBankAccountRouter

import express from 'express'

type ErrorMessage = {
  applicationSubmittedDay?: null | string
  applicationSubmittedMonth?: null | string
  applicationSubmittedYear?: null | string
  futureDate?: null | string
  resubmittedFutureDate?: null | string
  resubmittedHeardFutureDate?: null | string
  isValidDate?: null | string
  validResubmissionDate?: null | string
  validResubmissionHeardBackDate?: null | string
  noBankName?: null | string
  noStatus?: null | string
  dateResubmittedHeardDay?: null | string
  dateResubmittedHeardMonth?: null | string
  dateResubmittedHeardYear?: null | string
  applicationResubmittedDay?: null | string
  applicationResubmittedMonth?: null | string
  applicationResubmittedYear?: null | string
  accountOpenedDay?: null | string
  accountOpenedMonth?: null | string
  accountOpenedYear?: null | string
  isAccountOpenedFutureDate?: null | string
  validAccountOpenedDate?: null | string
  dateAddedDay?: null | string
  dateAddedMonth?: null | string
  dateAddedYear?: null | string
  isDateAddedFutureDate?: null | string
  validDateAdded?: null | string
  heardBackDay?: null | string
  heardBackMonth?: null | string
  heardBackYear?: null | string
  isHeardBackFutureDate?: null | string
  validHeardBackDate?: null | string
  isAccountOpenedFuture?: null | string
  noPersonalItems?: null | string
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
    validResubmissionDate: null,
    validResubmissionHeardBackDate: null,
    noStatus: null,
    applicationResubmittedDay: null,
    applicationResubmittedMonth: null,
    applicationResubmittedYear: null,
    dateResubmittedHeardDay: null,
    dateResubmittedHeardMonth: null,
    dateResubmittedHeardYear: null,
    accountOpenedDay: null,
    accountOpenedMonth: null,
    accountOpenedYear: null,
    isAccountOpenedFutureDate: null,
    validAccountOpenedDate: null,
    dateAddedDay: null,
    dateAddedMonth: null,
    dateAddedYear: null,
    isDateAddedFutureDate: null,
    validDateAdded: null,
    heardBackDay: null,
    heardBackMonth: null,
    heardBackYear: null,
    isHeardBackFutureDate: null,
    validHeardBackDate: null,
    isAccountOpenedFuture: null,
    noPersonalItems: null,
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
    accountOpenedDay,
    accountOpenedMonth,
    accountOpenedYear,
    dateAddedYear,
    dateAddedDay,
    dateAddedMonth,
    addedToPersonalItems,
    updatedStatus,
    heardBackDay,
    heardBackMonth,
    heardBackYear,
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
    const validResubmissionDate = isDateValid(
      `${applicationResubmittedYear}-${applicationResubmittedMonth}-${applicationResubmittedDay}`,
    )
    const validResubmissionHeardBackDate = isDateValid(
      `${dateResubmittedHeardYear}-${dateResubmittedHeardMonth}-${dateResubmittedHeardDay}`,
    )
    const validAccountOpenedDate = isDateValid(`${accountOpenedYear}-${accountOpenedMonth}-${accountOpenedDay}`)
    const validDateAdded = isDateValid(`${dateAddedYear}-${dateAddedMonth}-${dateAddedDay}`)
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
    const isAccountOpenedFutureDate = isDateInFuture(
      <string>accountOpenedDay,
      <string>accountOpenedMonth,
      <string>accountOpenedYear,
    )
    const isDateAddedFutureDate = isDateInFuture(<string>dateAddedDay, <string>dateAddedMonth, <string>dateAddedYear)

    if (
      !applicationResubmittedDay ||
      !applicationResubmittedMonth ||
      !applicationResubmittedYear ||
      isResubmittedFutureDate ||
      !validResubmissionDate
    ) {
      pageContainsError = true
      errorMsg.applicationResubmittedDay = applicationResubmittedDay ? null : `${dateFieldMissingMessage} day`
      errorMsg.applicationResubmittedMonth = applicationResubmittedMonth ? null : `${dateFieldMissingMessage} month`
      errorMsg.applicationResubmittedYear = applicationResubmittedYear ? null : `${dateFieldMissingMessage} year`
      errorMsg.resubmittedFutureDate = isResubmittedFutureDate ? 'The date of must be in the past' : null
      errorMsg.validResubmissionDate = validResubmissionDate ? null : dateFieldInvalid
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
        !validResubmissionHeardBackDate)
    ) {
      pageContainsError = true
      errorMsg.dateResubmittedHeardDay = dateResubmittedHeardDay ? null : `${dateFieldMissingMessage} day`
      errorMsg.dateResubmittedHeardMonth = dateResubmittedHeardMonth ? null : `${dateFieldMissingMessage} month`
      errorMsg.dateResubmittedHeardYear = dateResubmittedHeardYear ? null : `${dateFieldMissingMessage} year`
      errorMsg.resubmittedHeardFutureDate = isResubmittedHeardBackFutureDate ? 'The date of must be in the past' : null
      errorMsg.validResubmissionHeardBackDate = validResubmissionHeardBackDate ? null : dateFieldInvalid
    }

    if (
      status === 'Account opened' &&
      (!accountOpenedDay ||
        !accountOpenedMonth ||
        !accountOpenedYear ||
        isAccountOpenedFutureDate ||
        !validAccountOpenedDate ||
        !addedToPersonalItems)
    ) {
      pageContainsError = true
      errorMsg.accountOpenedDay = accountOpenedDay ? null : `${dateFieldMissingMessage} day`
      errorMsg.accountOpenedMonth = accountOpenedMonth ? null : `${dateFieldMissingMessage} month`
      errorMsg.accountOpenedYear = accountOpenedYear ? null : `${dateFieldMissingMessage} year`
      errorMsg.isAccountOpenedFutureDate = isAccountOpenedFutureDate ? 'The date of must be in the past' : null
      errorMsg.validAccountOpenedDate = validAccountOpenedDate ? null : dateFieldInvalid
      errorMsg.noPersonalItems = addedToPersonalItems ? null : 'Select if it was added to personal items'
    }

    if (
      status === 'Account opened' &&
      addedToPersonalItems === 'Yes' &&
      (!dateAddedDay || !dateAddedMonth || !dateAddedYear || isDateAddedFutureDate || !validDateAdded)
    ) {
      pageContainsError = true
      errorMsg.dateAddedDay = dateAddedDay ? null : `${dateFieldMissingMessage} day`
      errorMsg.dateAddedMonth = dateAddedMonth ? null : `${dateFieldMissingMessage} month`
      errorMsg.dateAddedYear = dateAddedYear ? null : `${dateFieldMissingMessage} year`
      errorMsg.isDateAddedFutureDate = isDateAddedFutureDate ? 'The date of must be in the past' : null
      errorMsg.validDateAdded = validDateAdded ? null : dateFieldInvalid
    }

    if (pageContainsError) {
      res.render('pages/add-bank-account', { prisonerData, params, req, errorMsg })
    } else {
      res.render('pages/add-bank-account-confirm', { prisonerData, params, req })
    }
  }

  function validateUpdate() {
    let pageContainsError = false

    const validHeardBackDate = isDateValid(`${heardBackYear}-${heardBackMonth}-${heardBackDay}`)
    const isHeardBackFutureDate = isDateInFuture(<string>heardBackDay, <string>heardBackMonth, <string>heardBackYear)

    const validDateAdded = isDateValid(`${dateAddedYear}-${dateAddedMonth}-${dateAddedDay}`)
    const isDateAddedFutureDate = isDateInFuture(<string>dateAddedDay, <string>dateAddedMonth, <string>dateAddedYear)

    const validAccountOpenedDate = isDateValid(`${accountOpenedYear}-${accountOpenedMonth}-${accountOpenedDay}`)
    const isAccountOpenedFuture = isDateInFuture(
      <string>accountOpenedDay,
      <string>accountOpenedMonth,
      <string>accountOpenedYear,
    )

    if (
      updatedStatus === 'Account opened' &&
      (!accountOpenedDay ||
        !accountOpenedMonth ||
        !accountOpenedYear ||
        isAccountOpenedFuture ||
        !validAccountOpenedDate ||
        !addedToPersonalItems)
    ) {
      pageContainsError = true
      errorMsg.accountOpenedDay = accountOpenedDay ? null : `${dateFieldMissingMessage} day`
      errorMsg.accountOpenedMonth = accountOpenedMonth ? null : `${dateFieldMissingMessage} month`
      errorMsg.accountOpenedYear = accountOpenedYear ? null : `${dateFieldMissingMessage} year`
      errorMsg.isAccountOpenedFuture = isAccountOpenedFuture ? 'The date of must be in the past' : null
      errorMsg.validAccountOpenedDate = validAccountOpenedDate ? null : dateFieldInvalid
      errorMsg.noPersonalItems = addedToPersonalItems ? null : 'Select if it was added to personal items'
    }

    if (
      updatedStatus === 'Account opened' &&
      addedToPersonalItems === 'Yes' &&
      (!dateAddedDay || !dateAddedMonth || !dateAddedYear || isDateAddedFutureDate || !validDateAdded)
    ) {
      pageContainsError = true
      errorMsg.dateAddedDay = dateAddedDay ? null : `${dateFieldMissingMessage} day`
      errorMsg.dateAddedMonth = dateAddedMonth ? null : `${dateFieldMissingMessage} month`
      errorMsg.dateAddedYear = dateAddedYear ? null : `${dateFieldMissingMessage} year`
      errorMsg.isDateAddedFutureDate = isDateAddedFutureDate ? 'The date of must be in the past' : null
      errorMsg.validDateAdded = validDateAdded ? null : dateFieldInvalid
    }

    if (
      updatedStatus !== 'Account opened' &&
      (!heardBackDay || !heardBackMonth || !heardBackYear || isHeardBackFutureDate || !validHeardBackDate)
    ) {
      pageContainsError = true
      errorMsg.heardBackDay = heardBackDay ? null : `${dateFieldMissingMessage} day`
      errorMsg.heardBackMonth = heardBackMonth ? null : `${dateFieldMissingMessage} month`
      errorMsg.heardBackYear = heardBackYear ? null : `${dateFieldMissingMessage} year`
      errorMsg.isHeardBackFutureDate = isHeardBackFutureDate ? 'The date of must be in the past' : null
      errorMsg.validHeardBackDate = validHeardBackDate ? null : dateFieldInvalid
    }

    if (pageContainsError) {
      res.render('pages/add-bank-account-update-status', { prisonerData, params, req, errorMsg })
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
    validateUpdate()
  }
})

export default confirmBankAccountRouter

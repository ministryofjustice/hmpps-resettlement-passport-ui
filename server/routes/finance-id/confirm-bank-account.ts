import express from 'express'

type ErrorMessage = {
  applicationSubmittedDay?: null | string
  applicationSubmittedMonth?: null | string
  applicationSubmittedYear?: null | string
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
  validAccountOpenedDate?: null | string
  dateAddedDay?: null | string
  dateAddedMonth?: null | string
  dateAddedYear?: null | string
  validDateAdded?: null | string
  heardBackDay?: null | string
  heardBackMonth?: null | string
  heardBackYear?: null | string
  validHeardBackDate?: null | string
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
    validAccountOpenedDate: null,
    dateAddedDay: null,
    dateAddedMonth: null,
    dateAddedYear: null,
    validDateAdded: null,
    heardBackDay: null,
    heardBackMonth: null,
    heardBackYear: null,
    validHeardBackDate: null,
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
    if (
      !applicationSubmittedDay ||
      !applicationSubmittedMonth ||
      !applicationSubmittedYear ||
      !bankName ||
      !isValidDate
    ) {
      errorMsg = {
        applicationSubmittedDay: applicationSubmittedDay ? null : `${dateFieldMissingMessage} day`,
        applicationSubmittedMonth: applicationSubmittedMonth ? null : `${dateFieldMissingMessage} month`,
        applicationSubmittedYear: applicationSubmittedYear ? null : `${dateFieldMissingMessage} year`,
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

    if (
      !applicationResubmittedDay ||
      !applicationResubmittedMonth ||
      !applicationResubmittedYear ||
      !validResubmissionDate
    ) {
      pageContainsError = true
      errorMsg.applicationResubmittedDay = applicationResubmittedDay ? null : `${dateFieldMissingMessage} day`
      errorMsg.applicationResubmittedMonth = applicationResubmittedMonth ? null : `${dateFieldMissingMessage} month`
      errorMsg.applicationResubmittedYear = applicationResubmittedYear ? null : `${dateFieldMissingMessage} year`
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
        !validResubmissionHeardBackDate)
    ) {
      pageContainsError = true
      errorMsg.dateResubmittedHeardDay = dateResubmittedHeardDay ? null : `${dateFieldMissingMessage} day`
      errorMsg.dateResubmittedHeardMonth = dateResubmittedHeardMonth ? null : `${dateFieldMissingMessage} month`
      errorMsg.dateResubmittedHeardYear = dateResubmittedHeardYear ? null : `${dateFieldMissingMessage} year`
      errorMsg.validResubmissionHeardBackDate = validResubmissionHeardBackDate ? null : dateFieldInvalid
    }

    if (
      status === 'Account opened' &&
      (!accountOpenedDay ||
        !accountOpenedMonth ||
        !accountOpenedYear ||
        !validAccountOpenedDate ||
        !addedToPersonalItems)
    ) {
      pageContainsError = true
      errorMsg.accountOpenedDay = accountOpenedDay ? null : `${dateFieldMissingMessage} day`
      errorMsg.accountOpenedMonth = accountOpenedMonth ? null : `${dateFieldMissingMessage} month`
      errorMsg.accountOpenedYear = accountOpenedYear ? null : `${dateFieldMissingMessage} year`
      errorMsg.validAccountOpenedDate = validAccountOpenedDate ? null : dateFieldInvalid
      errorMsg.noPersonalItems = addedToPersonalItems ? null : 'Select if it was added to personal items'
    }

    if (
      status === 'Account opened' &&
      addedToPersonalItems === 'Yes' &&
      (!dateAddedDay || !dateAddedMonth || !dateAddedYear || !validDateAdded)
    ) {
      pageContainsError = true
      errorMsg.dateAddedDay = dateAddedDay ? null : `${dateFieldMissingMessage} day`
      errorMsg.dateAddedMonth = dateAddedMonth ? null : `${dateFieldMissingMessage} month`
      errorMsg.dateAddedYear = dateAddedYear ? null : `${dateFieldMissingMessage} year`
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
    const validDateAdded = isDateValid(`${dateAddedYear}-${dateAddedMonth}-${dateAddedDay}`)
    const validAccountOpenedDate = isDateValid(`${accountOpenedYear}-${accountOpenedMonth}-${accountOpenedDay}`)

    if (
      updatedStatus === 'Account opened' &&
      (!accountOpenedDay ||
        !accountOpenedMonth ||
        !accountOpenedYear ||
        !validAccountOpenedDate ||
        !addedToPersonalItems)
    ) {
      pageContainsError = true
      errorMsg.accountOpenedDay = accountOpenedDay ? null : `${dateFieldMissingMessage} day`
      errorMsg.accountOpenedMonth = accountOpenedMonth ? null : `${dateFieldMissingMessage} month`
      errorMsg.accountOpenedYear = accountOpenedYear ? null : `${dateFieldMissingMessage} year`
      errorMsg.validAccountOpenedDate = validAccountOpenedDate ? null : dateFieldInvalid
      errorMsg.noPersonalItems = addedToPersonalItems ? null : 'Select if it was added to personal items'
    }

    if (
      updatedStatus === 'Account opened' &&
      addedToPersonalItems === 'Yes' &&
      (!dateAddedDay || !dateAddedMonth || !dateAddedYear || !validDateAdded)
    ) {
      pageContainsError = true
      errorMsg.dateAddedDay = dateAddedDay ? null : `${dateFieldMissingMessage} day`
      errorMsg.dateAddedMonth = dateAddedMonth ? null : `${dateFieldMissingMessage} month`
      errorMsg.dateAddedYear = dateAddedYear ? null : `${dateFieldMissingMessage} year`
      errorMsg.validDateAdded = validDateAdded ? null : dateFieldInvalid
    }

    if (
      updatedStatus !== 'Account opened' &&
      (!heardBackDay || !heardBackMonth || !heardBackYear || !validHeardBackDate)
    ) {
      pageContainsError = true
      errorMsg.heardBackDay = heardBackDay ? null : `${dateFieldMissingMessage} day`
      errorMsg.heardBackMonth = heardBackMonth ? null : `${dateFieldMissingMessage} month`
      errorMsg.heardBackYear = heardBackYear ? null : `${dateFieldMissingMessage} year`
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

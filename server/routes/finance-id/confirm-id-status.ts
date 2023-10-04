import express from 'express'

const confirmIdStatusRouter = express.Router().get('/', async (req, res, next) => {
  const { prisonerData } = req
  const params = req.query

  const {
    updatedStatus,
    isAddedToPersonalItems,
    addedToPersonalItemsDateDay,
    addedToPersonalItemsDateMonth,
    addedToPersonalItemsDateYear,
    dateIdReceivedDay,
    dateIdReceivedMonth,
    dateIdReceivedYear,
    refundAmount,
  } = params

  function checkIsValidCurrency(str: string): boolean {
    const regex = /^[0-9]+(\.[0-9]{2})?$/
    return regex.test(str)
  }

  const costIsValid: boolean = checkIsValidCurrency(<string>refundAmount)

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
  const isValidDateIdReceivedDate = isDateValid(`${dateIdReceivedYear}-${dateIdReceivedMonth}-${dateIdReceivedDay}`)
  const isValidAddedToPersonalItemsDate = isDateValid(
    `${addedToPersonalItemsDateYear}-${addedToPersonalItemsDateMonth}-${addedToPersonalItemsDateDay}`,
  )

  if (updatedStatus === 'Rejected' && (!refundAmount || !updatedStatus || !costIsValid)) {
    const refundMessage = 'Enter a refund amount'
    const statusMessage = 'Please choose a status'
    const costIsNotValidMessage = 'Refund amount can only include pounds and pence'
    const errorMsg = {
      refundAmount: refundAmount ? null : `${refundMessage}`,
      updatedStatus: updatedStatus ? null : `${statusMessage}`,
      costIsValid: costIsValid ? null : `${costIsNotValidMessage}`,
    }
    res.render('pages/add-id-update-status', { prisonerData, params, req, errorMsg })
    return
  }
  if (
    updatedStatus !== 'Rejected' &&
    (!updatedStatus ||
      !isAddedToPersonalItems ||
      !isValidDateIdReceivedDate ||
      !dateIdReceivedDay ||
      !dateIdReceivedMonth ||
      !dateIdReceivedYear)
  ) {
    const statusMessage = 'Please choose a status'
    const addedToPIMessage = 'Select an option'
    const dateFieldInvalid = 'The date must be a real date'
    const dateFieldMissingMessage = 'The date must include a'
    const errorMsg = {
      updatedStatus: updatedStatus ? null : `${statusMessage}`,
      isAddedToPersonalItems: isAddedToPersonalItems ? null : `${addedToPIMessage}`,
      dateIdReceivedDay: dateIdReceivedDay ? null : `${dateFieldMissingMessage} day`,
      dateIdReceivedMonth: dateIdReceivedMonth ? null : `${dateFieldMissingMessage} month`,
      dateIdReceivedYear: dateIdReceivedYear ? null : `${dateFieldMissingMessage} year`,
      isValidDateIdReceivedDate: isValidDateIdReceivedDate ? null : `${dateFieldInvalid}`,
    }
    res.render('pages/add-id-update-status', { prisonerData, params, req, errorMsg })
    return
  }
  if (
    isAddedToPersonalItems === 'true' &&
    (!isValidAddedToPersonalItemsDate ||
      !addedToPersonalItemsDateMonth ||
      !addedToPersonalItemsDateYear ||
      !addedToPersonalItemsDateDay)
  ) {
    const dateFieldInvalid = 'The date must be a real date'
    const dateFieldMissingMessage = 'The date must include a'
    const errorMsg = {
      addedToPersonalItemsDateDay: addedToPersonalItemsDateDay ? null : `${dateFieldMissingMessage} day`,
      addedToPersonalItemsDateMonth: addedToPersonalItemsDateMonth ? null : `${dateFieldMissingMessage} month`,
      addedToPersonalItemsDateYear: addedToPersonalItemsDateYear ? null : `${dateFieldMissingMessage} year`,
      isValidAddedToPersonalItemsDate: isValidAddedToPersonalItemsDate ? null : `${dateFieldInvalid}`,
    }
    res.render('pages/add-id-update-status', { prisonerData, params, req, errorMsg })
    return
  }
  res.render('pages/add-id-update-status-confirm', { prisonerData, params, req })
})

export default confirmIdStatusRouter

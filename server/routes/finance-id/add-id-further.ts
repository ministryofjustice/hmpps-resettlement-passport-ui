import express from 'express'

type ErrorMessage = {
  idType: null | string
  applicationSubmittedDay: null | string
  applicationSubmittedMonth: null | string
  applicationSubmittedYear: null | string
  futureDate: null | string
  isValidDate: null | string
}

const addIdFurtherRouter = express.Router().get('/', async (req, res, next) => {
  const { prisonerData } = req
  const params = req.query

  let errorMsg: ErrorMessage = {
    idType: null,
    applicationSubmittedDay: null,
    applicationSubmittedMonth: null,
    applicationSubmittedYear: null,
    futureDate: null,
    isValidDate: null,
  }

  const { idType, applicationSubmittedDay, applicationSubmittedMonth, applicationSubmittedYear } = params

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
  const isValidDate = isDateValid(`${applicationSubmittedYear}-${applicationSubmittedMonth}-${applicationSubmittedDay}`)
  if (
    !idType ||
    !applicationSubmittedDay ||
    !applicationSubmittedMonth ||
    !applicationSubmittedYear ||
    isFutureDate ||
    !isValidDate
  ) {
    const message = 'Select an option'
    const dateFieldMissingMessage = 'The date of application submitted must include a '
    const dateFieldInvalid = 'The date of application submitted must be a real date'
    errorMsg = {
      idType: idType ? null : message,
      applicationSubmittedDay: applicationSubmittedDay ? null : `${dateFieldMissingMessage} day`,
      applicationSubmittedMonth: applicationSubmittedMonth ? null : `${dateFieldMissingMessage} month`,
      applicationSubmittedYear: applicationSubmittedYear ? null : `${dateFieldMissingMessage} year`,
      futureDate: isFutureDate ? 'The date of application submitted must be in the past' : null,
      isValidDate: isValidDate ? null : dateFieldInvalid,
    }
    res.render('pages/add-id', { prisonerData, params, req, errorMsg })
    return
  }
  if (idType === 'National Insurance letter') {
    res.render('pages/add-id-confirm', { prisonerData, params, req })
    return
  }
  res.render('pages/add-id-further', { prisonerData, params, req })
})

export default addIdFurtherRouter

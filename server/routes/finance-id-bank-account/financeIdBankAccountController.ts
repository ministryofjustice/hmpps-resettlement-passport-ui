import { RequestHandler } from 'express'
import RpService from '../../services/rpService'
import logger from '../../../logger'
import { formatDateAsLocal, isDateValid } from '../../utils/utils'
import { BankAccountErrorMessage } from '../../data/model/bankAccountErrorMessage'
import PrisonerDetailsService from '../../services/prisonerDetailsService'

export default class FinanceIdBankAccountController {
  constructor(private readonly rpService: RpService, private readonly prisonerDetailsService: PrisonerDetailsService) {
    // no op
  }

  postBankAccountSubmitView: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const prisonerData = await this.prisonerDetailsService.loadPrisonerDetailsFromBody(req, res)
      const { prisonerNumber } = prisonerData.personalDetails
      const params = req.body
      const { applicationDate, bankName } = req.body

      try {
        await this.rpService.postBankApplication(prisonerNumber, {
          applicationSubmittedDate: formatDateAsLocal(applicationDate),
          bankName,
        })
        res.redirect(`/finance-and-id/?prisonerNumber=${prisonerNumber}#finance`)
      } catch (error) {
        const errorMessage = error.message
        logger.error('Error fetching finance data:', error)
        res.render('pages/add-bank-account-confirm', {
          errorMessage,
          prisonerData,
          params,
        })
      }
    } catch (err) {
      next(err)
    }
  }

  postBankAccountUpdateView: RequestHandler = async (req, res, next): Promise<void> => {
    const prisonerData = await this.prisonerDetailsService.loadPrisonerDetailsFromBody(req, res)
    const { prisonerNumber } = prisonerData.personalDetails
    const params = req.body
    const {
      applicationId,
      updatedStatus,
      bankResponseDate,
      isAddedToPersonalItems,
      addedToPersonalItemsDate,
      resubmissionDate,
    } = req.body

    try {
      await this.rpService.patchBankApplication(prisonerNumber, applicationId, {
        status: updatedStatus,
        bankResponseDate: formatDateAsLocal(bankResponseDate),
        isAddedToPersonalItems: isAddedToPersonalItems === 'Yes',
        addedToPersonalItemsDate: formatDateAsLocal(addedToPersonalItemsDate),
        resubmissionDate: formatDateAsLocal(resubmissionDate),
      })
      res.redirect(`/finance-and-id/?prisonerNumber=${prisonerNumber}#finance`)
    } catch (error) {
      const errorMessage = error.message
      logger.error('Error updating banking application:', error)
      res.render('pages/add-bank-account-confirm', {
        errorMessage,
        prisonerData,
        params,
      })
    }
  }

  getAddABankAccountView: RequestHandler = async (req, res) => {
    const prisonerData = await this.prisonerDetailsService.loadPrisonerDetailsFromParam(req, res)
    const params = req.query
    res.render('pages/add-bank-account', { prisonerData, params })
  }

  getUpdateBankAccountStatusView: RequestHandler = async (req, res) => {
    const prisonerData = await this.prisonerDetailsService.loadPrisonerDetailsFromParam(req, res)
    const params = req.query
    res.render('pages/add-bank-account-update-status', { prisonerData, params, req })
  }

  getConfirmAddABankAccountView: RequestHandler = async (req, res, next) => {
    const prisonerData = await this.prisonerDetailsService.loadPrisonerDetailsFromParam(req, res)
    const params = req.query

    let errorMsg: BankAccountErrorMessage = {
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
    try {
      if (confirmationType === 'addAccount') {
        validateNewAccount()
      } else if (confirmationType === 'resubmit' || applicationType === 'resubmit') {
        validateResubmit()
      } else if (confirmationType === 'updateStatus') {
        validateUpdate()
      } else {
        next(new Error('Unknown confirmation/application type'))
      }
    } catch (err) {
      next(err)
    }
  }
}

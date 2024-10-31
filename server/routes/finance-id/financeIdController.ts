import { RequestHandler } from 'express'
import RpService from '../../services/rpService'
import logger from '../../../logger'
import { BankAccountErrorMessage } from '../../data/model/bankAccountErrorMessage'
import { formatDateAsLocal, isDateValid } from '../../utils/utils'
import FinanceIdView from './financeIdView'
import { BankApplicationResponse, IdApplicationResponse } from '../../data/model/financeId'

export default class FinanceIdController {
  constructor(private readonly rpService: RpService) {
    // no op
  }

  getView: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const { prisonerData } = req
      if (!prisonerData) {
        return next(new Error('Prisoner number is missing from request'))
      }

      const {
        page = '0',
        pageSize = '10',
        sort = 'occurenceDateTime%2CDESC',
        days = '0',
        createdByUserId = '0',
      } = req.query
      const prisonerNumber = prisonerData.personalDetails.prisonerNumber as string

      let finance: BankApplicationResponse = {}
      let id: IdApplicationResponse = {}
      // FETCH FINANCE
      try {
        finance = await this.rpService.fetchFinance(prisonerNumber)
      } catch (err) {
        logger.warn(`Error fetching finance data`, err)
        finance.error = true
      }
      // FETCH ID
      try {
        id = await this.rpService.fetchId(prisonerNumber)
      } catch (err) {
        logger.warn(`Error fetching ID data`, err)
        id.error = true
      }
      // CRS Referrals
      const crsReferrals = await this.rpService.getCrsReferrals(
        prisonerData.personalDetails.prisonerNumber as string,
        'FINANCE_AND_ID',
      )

      const assessmentData = await this.rpService.getAssessmentInformation(
        prisonerData.personalDetails.prisonerNumber as string,
        'FINANCE_AND_ID',
      )

      const caseNotesData = await this.rpService.getCaseNotesHistory(
        prisonerData.personalDetails.prisonerNumber as string,
        'FINANCE_AND_ID',
        createdByUserId as string,
        pageSize as string,
        page as string,
        sort as string,
        days as string,
      )

      const caseNotesCreators = await this.rpService.getCaseNotesCreators(
        prisonerData.personalDetails.prisonerNumber as string,
        'FINANCE_AND_ID',
      )

      const view = new FinanceIdView(
        prisonerData,
        crsReferrals,
        assessmentData,
        caseNotesData,
        caseNotesCreators,
        createdByUserId as string,
        pageSize as string,
        page as string,
        sort as string,
        days as string,
        finance,
        id,
      )
      return res.render('pages/finance-id', { ...view.renderArgs })
    } catch (err) {
      return next(err)
    }
  }

  postBankAccountDelete: RequestHandler = async (req, res, next) => {
    try {
      const { prisonerNumber, financeId } = req.body

      if (!prisonerNumber || !financeId) {
        return next(new Error('prisonerNumber or financeId missing from request body'))
      }

      await this.rpService.deleteFinance(prisonerNumber, financeId as string)

      return res.redirect(`/finance-and-id?prisonerNumber=${prisonerNumber}#finance`)
    } catch (err) {
      return next(err)
    }
  }

  postIdDelete: RequestHandler = async (req, res, next) => {
    try {
      const { prisonerNumber, idId } = req.body

      if (!prisonerNumber || !idId) {
        return next(new Error('prisonerNumber or idId missing from request body'))
      }

      await this.rpService.deleteId(prisonerNumber, idId as string)

      return res.redirect(`/finance-and-id?prisonerNumber=${prisonerNumber}#id`)
    } catch (err) {
      return next(err)
    }
  }

  postBankAccountSubmitView: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const { prisonerData } = req
      const params = req.body
      const { prisonerNumber, applicationDate, bankName } = req.body

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
    try {
      const { prisonerData } = req
      const params = req.body
      const {
        prisonerNumber,
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
    } catch (err) {
      next(err)
    }
  }

  getAddABankAccountView: RequestHandler = (req, res, next) => {
    const { prisonerData } = req
    const params = req.query
    res.render('pages/add-bank-account', { prisonerData, params })
  }

  getUpdateBankAccountStatusView: RequestHandler = (req, res, next) => {
    const { prisonerData } = req
    const params = req.query
    res.render('pages/add-bank-account-update-status', { prisonerData, params, req })
  }

  getConfirmAddABankAccountView: RequestHandler = (req, res, next) => {
    const { prisonerData } = req
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
      }
      if (confirmationType === 'resubmit' || applicationType === 'resubmit') {
        validateResubmit()
      }
      if (confirmationType === 'updateStatus') {
        validateUpdate()
      }
    } catch (err) {
      next(err)
    }
  }
}

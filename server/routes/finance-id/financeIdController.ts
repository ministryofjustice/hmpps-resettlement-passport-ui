import { RequestHandler } from 'express'
import RpService from '../../services/rpService'
import { RPClient } from '../../data'
import logger from '../../../logger'
import { AssessmentErrorMessage } from '../../data/model/assessmentErrorMessage'
import { BankAccountErrorMessage } from '../../data/model/bankAccountErrorMessage'
import { IdErrorMessage } from '../../data/model/idErrorMessage'
import { isDateValid } from '../../utils/utils'
import DrugsAlcoholView from '../drugs-alcohol/drugsAlcoholView'
import FinanceIdView from './financeIdView'

export default class FinanceIdController {
  constructor(private readonly rpService: RpService) {}

  getView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerData } = req
    const { token } = req.user
    const { deleteAssessmentConfirmed, assessmentId, deleteFinanceConfirmed, financeId, idId, deleteIdConfirmed } =
      req.query

    const apiResponse = new RPClient(req.user.token, req.sessionID, req.user.username)
    let assessment: { error?: boolean } = {}
    let assessmentDeleted: { error?: boolean } = {}
    let finance: { error?: boolean } = {}
    let financeDeleted: { error?: boolean } = {}
    let id: { error?: boolean } = {}
    let idDeleted: { error?: boolean } = {}

    // DELETE ASSESSMENT
    if (deleteAssessmentConfirmed) {
      try {
        assessmentDeleted = await apiResponse.delete(
          `/resettlement-passport/prisoner/${prisonerData.personalDetails.prisonerNumber}/assessment/${assessmentId}`,
        )
      } catch (err) {
        logger.warn(`Error deleting assessment`, err)
        assessmentDeleted.error = true
      }
    }
    // FETCH ASSESSMENT
    try {
      assessment = await apiResponse.get(
        `/resettlement-passport/prisoner/${prisonerData.personalDetails.prisonerNumber}/assessment`,
      )
    } catch (err) {
      logger.warn(`Error fetching assessment data`, err)
      assessment.error = true
    }
    // DELETE FINANCE
    if (deleteFinanceConfirmed) {
      try {
        financeDeleted = await apiResponse.delete(
          `/resettlement-passport/prisoner/${prisonerData.personalDetails.prisonerNumber}/bankapplication/${financeId}`,
        )
      } catch (err) {
        logger.warn(`Error deleting finance`, err)
        financeDeleted.error = true
      }
    }
    // FETCH FINANCE
    try {
      finance = await apiResponse.get(
        `/resettlement-passport/prisoner/${prisonerData.personalDetails.prisonerNumber}/bankapplication`,
      )
    } catch (err) {
      logger.warn(`Error fetching finance data`, err)
      finance.error = true
    }
    // DELETE ID
    if (deleteIdConfirmed) {
      try {
        idDeleted = await apiResponse.delete(
          `/resettlement-passport/prisoner/${prisonerData.personalDetails.prisonerNumber}/idapplication/${idId}`,
        )
      } catch (err) {
        logger.warn(`Error deleting ID`, err)
        idDeleted.error = true
      }
    }
    // FETCH ID
    try {
      id = await apiResponse.get(
        `/resettlement-passport/prisoner/${prisonerData.personalDetails.prisonerNumber}/idapplication/all`,
      )
    } catch (err) {
      logger.warn(`Error fetching ID data`, err)
      id.error = true
    }
    // CRS Referrals
    const crsReferrals = await this.rpService.getCrsReferrals(
      token,
      req.sessionID,
      prisonerData.personalDetails.prisonerNumber as string,
      'FINANCE_AND_ID',
    )

    const view = new FinanceIdView(prisonerData, crsReferrals)
    res.render('pages/finance-id', { ...view.renderArgs, assessment, finance, id })
  }

  postAssessmentSubmitView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerData } = req
    const params = req.body
    const { prisonerNumber, assessmentDate, isBankAccountRequired, isIdRequired } = req.body
    let idDocuments: object | null | undefined = null
    idDocuments = req.body.idDocuments
    if (idDocuments === null) {
      idDocuments = []
    }
    if (typeof idDocuments === 'string') {
      idDocuments = [idDocuments]
    }

    const rpClient = new RPClient(req.user.token, req.sessionID, req.user.username)
    try {
      await rpClient.post(`/resettlement-passport/prisoner/${prisonerNumber}/assessment`, {
        assessmentDate,
        isBankAccountRequired,
        isIdRequired,
        idDocuments,
        nomsId: prisonerNumber,
      })
      res.redirect(`/finance-and-id?prisonerNumber=${prisonerNumber}`)
    } catch (error) {
      const errorMessage = error.message
      logger.error('Error fetching assessment:', error)
      res.render('pages/assessment-confirmation', {
        errorMessage,
        prisonerData,
        params,
      })
    }
  }

  postBankAccountSubmitView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerData } = req
    const params = req.body
    const { prisonerNumber, applicationDate, bankName } = req.body

    const rpClient = new RPClient(req.user.token, req.sessionID, req.user.username)
    try {
      await rpClient.post(`/resettlement-passport/prisoner/${prisonerNumber}/bankapplication`, {
        applicationSubmittedDate: applicationDate,
        bankName,
      })
      res.redirect(`/finance-and-id/?prisonerNumber=${prisonerNumber}`)
    } catch (error) {
      const errorMessage = error.message
      logger.error('Error fetching finance data:', error)
      res.render('pages/add-bank-account-confirm', {
        errorMessage,
        prisonerData,
        params,
      })
    }
  }

  postIdSubmitView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerData } = req
    const params = req.body
    const {
      prisonerNumber,
      idType,
      applicationSubmittedDate,
      haveGro,
      isUkNationalBornOverseas,
      countryBornIn,
      isPriorityApplication,
      caseNumber,
      courtDetails,
      driversLicenceType,
      driversLicenceApplicationMadeAt,
    } = req.body
    const costOfApplication = Number(req.body.costOfApplication)
    const rpClient = new RPClient(req.user.token, req.sessionID, req.user.username)
    try {
      await rpClient.post(`/resettlement-passport/prisoner/${prisonerNumber}/idapplication`, {
        idType,
        applicationSubmittedDate,
        isPriorityApplication,
        costOfApplication,
        haveGro,
        isUkNationalBornOverseas,
        countryBornIn,
        caseNumber,
        courtDetails,
        driversLicenceType,
        driversLicenceApplicationMadeAt,
      })
      res.redirect(`/finance-and-id/?prisonerNumber=${prisonerNumber}`)
    } catch (error) {
      const errorMessage = error.message
      logger.error('Error fetching id data:', error)
      res.render('pages/add-id-confirm', {
        errorMessage,
        prisonerData,
        params,
      })
    }
  }

  postBankAccountUpdateView: RequestHandler = async (req, res, next): Promise<void> => {
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

    const rpClient = new RPClient(req.user.token, req.sessionID, req.user.username)
    try {
      await rpClient.patch(`/resettlement-passport/prisoner/${prisonerNumber}/bankapplication/${applicationId}`, {
        status: updatedStatus,
        bankResponseDate,
        isAddedToPersonalItems: isAddedToPersonalItems === 'Yes',
        addedToPersonalItemsDate,
        resubmissionDate,
      })
      res.redirect(`/finance-and-id/?prisonerNumber=${prisonerNumber}`)
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

  postIdUpdateView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerData } = req
    const params = req.body
    const {
      prisonerNumber,
      applicationId,
      isAddedToPersonalItems,
      addedToPersonalItemsDate,
      updatedStatus,
      statusUpdateDate,
      dateIdReceived,
    } = req.body

    const refundAmount = Number(req.body.refundAmount)
    const rpClient = new RPClient(req.user.token, req.sessionID, req.user.username)
    try {
      await rpClient.patch(`/resettlement-passport/prisoner/${prisonerNumber}/idapplication/${applicationId}`, {
        status: updatedStatus,
        isAddedToPersonalItems,
        addedToPersonalItemsDate,
        statusUpdateDate,
        dateIdReceived,
        refundAmount,
      })
      res.redirect(`/finance-and-id/?prisonerNumber=${prisonerNumber}`)
    } catch (error) {
      const errorMessage = error.message
      logger.error('Error updating id application:', error)
      res.render('pages/add-id-update-status-confirm', {
        errorMessage,
        prisonerData,
        params,
      })
    }
  }

  getAddAnIdView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerData } = req
    const params = req.query
    res.render('pages/add-id', { prisonerData, params })
  }

  getAddABankAccountView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerData } = req
    const params = req.query
    res.render('pages/add-bank-account', { prisonerData, params })
  }

  getUpdateBankAccountStatusView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerData } = req
    const params = req.query
    res.render('pages/add-bank-account-update-status', { prisonerData, params, req })
  }

  getConfirmAssessmentView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerData } = req
    const params = req.query
    let errorMsg: AssessmentErrorMessage = {
      idRequired: null,
      bankAccountRequired: null,
      dateAssessmentDay: null,
      dateAssessmentMonth: null,
      dateAssessmentYear: null,
      isValidDate: null,
    }

    const { isIdRequired, isBankAccountRequired, dateAssessmentDay, dateAssessmentMonth, dateAssessmentYear } = params

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
  }

  getConfirmAddABankAccountView: RequestHandler = async (req, res, next): Promise<void> => {
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

    if (confirmationType === 'addAccount') {
      validateNewAccount()
    }
    if (confirmationType === 'resubmit' || applicationType === 'resubmit') {
      validateResubmit()
    }
    if (confirmationType === 'updateStatus') {
      validateUpdate()
    }
  }

  getConfirmAddAnIdView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerData } = req
    const params = req.query

    const {
      haveGro,
      isUkNationalBornOverseas,
      countryBornIn,
      isPriorityApplication,
      idType,
      caseNumber,
      courtDetails,
      driversLicenceType,
      driversLicenceApplicationMadeAt,
      costOfApplication,
    } = params

    function checkIsValidCurrency(str: string): boolean {
      const regex = /^[0-9]+(\.[0-9]{2})?$/
      return regex.test(str)
    }

    const costIsValid: boolean = checkIsValidCurrency(<string>costOfApplication)

    if (!costOfApplication || !costIsValid) {
      const costMessage = 'Enter the cost of application'
      const costIsNotValidMessage = 'Application cost can only include pounds and pence'
      const errorMsg = {
        costOfApplication: costOfApplication ? null : `${costMessage}`,
        costIsValid: costIsValid ? null : `${costIsNotValidMessage}`,
      }
      res.render('pages/add-id-further', { prisonerData, params, req, errorMsg })
      return
    }
    if (
      (idType === 'Birth certificate' ||
        idType === 'Marriage certificate' ||
        idType === 'Civil partnership certificate') &&
      (!haveGro || !isUkNationalBornOverseas || !isPriorityApplication)
    ) {
      const message = 'Select an option'
      const errorMsg = {
        haveGro: haveGro ? null : `${message}`,
        isUkNationalBornOverseas: isUkNationalBornOverseas ? null : `${message}`,
        isPriorityApplication: isPriorityApplication ? null : `${message}`,
      }
      res.render('pages/add-id-further', { prisonerData, params, req, errorMsg })
      return
    }
    if (
      (idType === 'Birth certificate' ||
        idType === 'Marriage certificate' ||
        idType === 'Civil partnership certificate') &&
      isUkNationalBornOverseas === 'true' &&
      countryBornIn === ''
    ) {
      const countryBornMessage = 'Select a country'
      const errorMsg = {
        countryBornIn: countryBornIn ? null : `${countryBornMessage}`,
      }
      res.render('pages/add-id-further', { prisonerData, params, req, errorMsg })
      return
    }
    if (idType === 'Adoption certificate' && (!haveGro || !isPriorityApplication)) {
      const message = 'Select an option'
      const errorMsg = {
        haveGro: haveGro ? null : `${message}`,
        isPriorityApplication: isPriorityApplication ? null : `${message}`,
      }
      res.render('pages/add-id-further', { prisonerData, params, req, errorMsg })
      return
    }
    if (idType === 'Divorce decree absolute certificate' && (!caseNumber || !courtDetails)) {
      const caseNumberMessage = 'Enter a case number'
      const courtDetailMessage = 'Enter court details'
      const errorMsg = {
        caseNumber: caseNumber ? null : `${caseNumberMessage}`,
        courtDetails: courtDetails ? null : `${courtDetailMessage}`,
      }
      res.render('pages/add-id-further', { prisonerData, params, req, errorMsg })
      return
    }
    if (idType === 'Driving licence' && (!driversLicenceApplicationMadeAt || !driversLicenceType)) {
      const errorMsg = {
        driversLicenceType: driversLicenceType === '' ? 'Choose a driving licence type' : null,
        driversLicenceApplicationMadeAt:
          driversLicenceApplicationMadeAt !== '' ? null : 'Choose where application was made',
      }
      res.render('pages/add-id-further', { prisonerData, params, req, errorMsg })
      return
    }
    res.render('pages/add-id-confirm', { prisonerData, params, req })
  }

  getAssessmentView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerData } = req
    const params = req.query
    res.render('pages/assessment', { prisonerData, params })
  }

  getAddAnIdFurtherView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerData } = req
    const params = req.query

    let errorMsg: IdErrorMessage = {
      idType: null,
      applicationSubmittedDay: null,
      applicationSubmittedMonth: null,
      applicationSubmittedYear: null,
      isValidDate: null,
    }

    const { idType, applicationSubmittedDay, applicationSubmittedMonth, applicationSubmittedYear } = params

    const isValidDate = isDateValid(
      `${applicationSubmittedYear}-${applicationSubmittedMonth}-${applicationSubmittedDay}`,
    )
    if (
      !idType ||
      !applicationSubmittedDay ||
      !applicationSubmittedMonth ||
      !applicationSubmittedYear ||
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
        isValidDate: isValidDate ? null : dateFieldInvalid,
      }
      res.render('pages/add-id', { prisonerData, params, req, errorMsg })
      return
    }
    if (params.idType === 'National Insurance Number letter') {
      res.render('pages/add-id-confirm', { prisonerData, params, req })
      return
    }
    res.render('pages/add-id-further', { prisonerData, params, req })
  }

  getUpdateIdStatusView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerData } = req
    const params = req.query
    res.render('pages/add-id-update-status', { prisonerData, params, req })
  }

  getConfirmAddAnIdStatusView: RequestHandler = async (req, res, next): Promise<void> => {
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
  }
}

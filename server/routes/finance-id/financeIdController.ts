import { RequestHandler } from 'express'
import RpService from '../../services/rpService'
import logger from '../../../logger'
import { AssessmentErrorMessage } from '../../data/model/assessmentErrorMessage'
import { IdErrorMessage } from '../../data/model/idErrorMessage'
import { formatDateAsLocal, isDateValid } from '../../utils/utils'
import FinanceIdView from './financeIdView'

export default class FinanceIdController {
  constructor(private readonly rpService: RpService) {
    // no op
  }

  getView: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const { prisonerData } = req
      const { deleteAssessmentConfirmed, assessmentId, deleteFinanceConfirmed, financeId, idId, deleteIdConfirmed } =
        req.query
      const {
        page = '0',
        pageSize = '10',
        sort = 'occurenceDateTime%2CDESC',
        days = '0',
        createdByUserId = '0',
      } = req.query
      const prisonerNumber = prisonerData.personalDetails.prisonerNumber as string

      let assessment: { error?: boolean } = {}
      let assessmentDeleted: { error?: boolean } = {}
      let finance: { error?: boolean } = {}
      let financeDeleted: { error?: boolean } = {}
      let id: { error?: boolean } = {}
      let idDeleted: { error?: boolean } = {}

      // DELETE ASSESSMENT
      if (deleteAssessmentConfirmed) {
        try {
          assessmentDeleted = await this.rpService.deleteAssessment(prisonerNumber, assessmentId as string)
        } catch (err) {
          logger.warn(`Error deleting assessment`, err)
          assessmentDeleted.error = true
        }
      }
      // FETCH ASSESSMENT
      try {
        assessment = await this.rpService.fetchAssessment(prisonerNumber)
      } catch (err) {
        logger.warn(`Error fetching assessment data`, err)
        assessment.error = true
      }
      // DELETE FINANCE
      if (deleteFinanceConfirmed) {
        try {
          financeDeleted = await this.rpService.deleteFinance(prisonerNumber, financeId as string)
        } catch (err) {
          logger.warn(`Error deleting finance`, err)
          financeDeleted.error = true
        }
      }
      // FETCH FINANCE
      try {
        finance = await this.rpService.fetchFinance(prisonerNumber)
      } catch (err) {
        logger.warn(`Error fetching finance data`, err)
        finance.error = true
      }
      // DELETE ID
      if (deleteIdConfirmed) {
        try {
          idDeleted = await this.rpService.deleteId(prisonerNumber, idId as string)
        } catch (err) {
          logger.warn(`Error deleting ID`, err)
          idDeleted.error = true
        }
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
      )
      res.render('pages/finance-id', { ...view.renderArgs, assessment, finance, id })
    } catch (err) {
      next(err)
    }
  }

  postAssessmentSubmitView: RequestHandler = async (req, res, next): Promise<void> => {
    try {
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

      try {
        await this.rpService.postAssessment(prisonerNumber, {
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
    } catch (err) {
      next(err)
    }
  }

  postIdSubmitView: RequestHandler = async (req, res, next): Promise<void> => {
    try {
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
      try {
        await this.rpService.postIdApplication(prisonerNumber, {
          idType,
          applicationSubmittedDate: formatDateAsLocal(applicationSubmittedDate),
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
        res.redirect(`/finance-and-id/?prisonerNumber=${prisonerNumber}#id`)
      } catch (error) {
        const errorMessage = error.message
        logger.error('Error fetching id data:', error)
        res.render('pages/add-id-confirm', {
          errorMessage,
          prisonerData,
          params,
        })
      }
    } catch (err) {
      next(err)
    }
  }

  postIdUpdateView: RequestHandler = async (req, res, next): Promise<void> => {
    try {
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
      try {
        await this.rpService.patchIdApplication(prisonerNumber, applicationId, {
          status: updatedStatus,
          isAddedToPersonalItems,
          addedToPersonalItemsDate: formatDateAsLocal(addedToPersonalItemsDate),
          statusUpdateDate: formatDateAsLocal(statusUpdateDate),
          dateIdReceived: formatDateAsLocal(dateIdReceived),
          refundAmount,
        })
        res.redirect(`/finance-and-id/?prisonerNumber=${prisonerNumber}#id`)
      } catch (error) {
        const errorMessage = error.message
        logger.error('Error updating id application:', error)
        res.render('pages/add-id-update-status-confirm', {
          errorMessage,
          prisonerData,
          params,
        })
      }
    } catch (err) {
      next(err)
    }
  }

  getAddAnIdView: RequestHandler = (req, res, next) => {
    const { prisonerData } = req
    const params = req.query
    res.render('pages/add-id', { prisonerData, params })
  }

  getConfirmAssessmentView: RequestHandler = (req, res, next) => {
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

  getConfirmAddAnIdView: RequestHandler = (req, res, next) => {
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

    try {
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
    } catch (err) {
      next(err)
    }
  }

  getAssessmentView: RequestHandler = (req, res, next) => {
    const { prisonerData } = req
    const params = req.query
    res.render('pages/assessment', { prisonerData, params })
  }

  getAddAnIdFurtherView: RequestHandler = (req, res, next) => {
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

  getUpdateIdStatusView: RequestHandler = (req, res, next) => {
    const { prisonerData } = req
    const params = req.query
    res.render('pages/add-id-update-status', { prisonerData, params, req })
  }

  getConfirmAddAnIdStatusView: RequestHandler = (req, res, next) => {
    function checkIsValidCurrency(str: string): boolean {
      const regex = /^[0-9]+(\.[0-9]{2})?$/
      return regex.test(str)
    }

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

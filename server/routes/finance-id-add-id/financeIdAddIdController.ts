import { RequestHandler } from 'express'
import RpService from '../../services/rpService'
import { formatDateAsLocal, isDateValid } from '../../utils/utils'
import logger from '../../../logger'
import { IdErrorMessage } from '../../data/model/idErrorMessage'
import PrisonerDetailsService from '../../services/prisonerDetailsService'

export default class FinanceIdAddIdController {
  constructor(private readonly rpService: RpService, private readonly prisonerDetailsService: PrisonerDetailsService) {
    // no op
  }

  postIdSubmitView: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const prisonerData = await this.prisonerDetailsService.loadPrisonerDetailsFromBody(req, res)
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
      const prisonerData = await this.prisonerDetailsService.loadPrisonerDetailsFromBody(req, res)
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

  getAddAnIdView: RequestHandler = async (req, res, next) => {
    try {
      const prisonerData = await this.prisonerDetailsService.loadPrisonerDetailsFromParam(req, res)
      const params = req.query
      res.render('pages/add-id', { prisonerData, params })
    } catch (error) {
      next(error)
    }
  }

  getConfirmAddAnIdView: RequestHandler = async (req, res, next) => {
    function checkIsValidCurrency(str: string): boolean {
      const regex = /^[0-9]+(\.[0-9]{2})?$/
      return regex.test(str)
    }

    try {
      const params = req.query
      const prisonerData = await this.prisonerDetailsService.loadPrisonerDetailsFromParam(req, res)

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

  getAddAnIdFurtherView: RequestHandler = async (req, res, next) => {
    try {
      const prisonerData = await this.prisonerDetailsService.loadPrisonerDetailsFromParam(req, res)
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
    } catch (err) {
      next(err)
    }
  }

  getUpdateIdStatusView: RequestHandler = async (req, res, next) => {
    const prisonerData = await this.prisonerDetailsService.loadPrisonerDetailsFromParam(req, res)
    const params = req.query
    res.render('pages/add-id-update-status', { prisonerData, params, req })
  }

  getConfirmAddAnIdStatusView: RequestHandler = async (req, res, next) => {
    function checkIsValidCurrency(str: string): boolean {
      const regex = /^[0-9]+(\.[0-9]{2})?$/
      return regex.test(str)
    }

    const prisonerData = await this.prisonerDetailsService.loadPrisonerDetailsFromParam(req, res)
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

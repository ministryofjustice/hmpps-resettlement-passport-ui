import { RequestHandler } from 'express'
import { query, validationResult } from 'express-validator'
import { isAlphanumeric, isNumeric } from 'validator'
import RpService from '../../services/rpService'
import logger from '../../../logger'
import FinanceIdView from './financeIdView'
import { BankApplicationResponse, IdApplicationResponse } from '../../data/model/financeId'
import PrisonerDetailsService from '../../services/prisonerDetailsService'
import { handleWhatsNewBanner } from '../whatsNewBanner'
import { badRequestError } from '../../errorHandler'
import { getFeatureFlagBoolean } from '../../utils/utils'
import { FEATURE_FLAGS } from '../../utils/constants'

export default class FinanceIdController {
  constructor(private readonly rpService: RpService, private readonly prisonerDetailsService: PrisonerDetailsService) {
    // no op
  }

  // Validation for query parameters
  validateQuery = [
    query('supportNeedUpdateSort')
      .optional()
      .isIn(['createdDate,DESC', 'createdDate,ASC'])
      .withMessage('supportNeedUpdateSort must be createdDate,DESC or createdDate,ASC'),
  ]

  getView: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const prisonerData = await this.prisonerDetailsService.loadPrisonerDetailsFromParam(req, res)
      handleWhatsNewBanner(req, res)
      const supportNeedsEnabled = await getFeatureFlagBoolean(FEATURE_FLAGS.SUPPORT_NEEDS)

      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        // Validation failed
        return next(badRequestError('Invalid query parameters'))
      }

      const pageSize = '10'
      const sort = 'occurenceDateTime%2CDESC'
      const days = '0'
      const { page = '0', createdByUserId = '0' } = req.query

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

      let pathwaySupportNeedsSummary = null
      let supportNeedsUpdates = null
      const { supportNeedUpdateSort = 'createdDate,DESC' } = req.query

      if (supportNeedsEnabled) {
        const pathwaySupportNeedsResponse = await this.rpService.getPathwaySupportNeedsSummary(
          prisonerData.personalDetails.prisonerNumber as string,
          'FINANCE_AND_ID',
        )
        pathwaySupportNeedsSummary = {
          ...pathwaySupportNeedsResponse,
          supportNeedsSet: pathwaySupportNeedsResponse.prisonerNeeds.length > 0,
        }
        supportNeedsUpdates = await this.rpService.getPathwayNeedsUpdates(
          prisonerData.personalDetails.prisonerNumber as string,
          'FINANCE_AND_ID',
          0,
          1000, // TODO - add pagination, for now just get the first 1000
          supportNeedUpdateSort as string,
          '',
        )
      }

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
        pathwaySupportNeedsSummary,
        supportNeedsUpdates,
        supportNeedUpdateSort as string,
      )
      return res.render('pages/finance-id', { ...view.renderArgs })
    } catch (err) {
      return next(err)
    }
  }

  postBankAccountDelete: RequestHandler = async (req, res, next) => {
    try {
      const { prisonerNumber, financeId } = req.body

      if (!isValidPrisonerNumber(prisonerNumber) || !isValidId(financeId)) {
        return next(badRequestError('prisonerNumber or financeId are invalid or not present in request'))
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

      if (!isValidPrisonerNumber(prisonerNumber) || !isValidId(idId)) {
        return next(badRequestError('prisonerNumber or idId are invalid or not present in request'))
      }

      await this.rpService.deleteId(prisonerNumber, idId as string)

      return res.redirect(`/finance-and-id?prisonerNumber=${prisonerNumber}#id`)
    } catch (err) {
      return next(err)
    }
  }
}

function isValidPrisonerNumber(prisonerNumber: string): boolean {
  return prisonerNumber && isAlphanumeric(prisonerNumber)
}

function isValidId(id: string): boolean {
  return id && isNumeric(id)
}

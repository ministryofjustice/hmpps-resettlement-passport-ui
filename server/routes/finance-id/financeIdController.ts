import { RequestHandler } from 'express'
import RpService from '../../services/rpService'
import logger from '../../../logger'
import FinanceIdView from './financeIdView'
import { BankApplicationResponse, IdApplicationResponse } from '../../data/model/financeId'
import { handleWhatsNewBanner } from '../whatsNew'

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
      handleWhatsNewBanner(req, res)

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
}

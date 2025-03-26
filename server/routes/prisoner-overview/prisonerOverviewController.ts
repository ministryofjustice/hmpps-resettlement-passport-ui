import { RequestHandler } from 'express'
import { validationResult } from 'express-validator'
import logger from '../../../logger'
import { ERROR_DICTIONARY, FEATURE_FLAGS } from '../../utils/constants'
import DocumentService from '../../services/documentService'
import RpService from '../../services/rpService'
import { Appointment } from '../../data/model/appointment'
import PrisonerDetailsService from '../../services/prisonerDetailsService'
import { handleWhatsNewBanner } from '../whatsNewBanner'
import { DocumentMeta } from '../../data/model/documents'
import { getFeatureFlagBoolean } from '../../utils/utils'
import { badRequestError } from '../../errorHandler'

export default class PrisonerOverviewController {
  constructor(
    private readonly documentService: DocumentService,
    private readonly rpService: RpService,
    private readonly prisonerDetailsService: PrisonerDetailsService,
  ) {
    // no op
  }

  getPrisoner: RequestHandler = async (req, res, next): Promise<void> => {
    const supportNeedsEnabled = await getFeatureFlagBoolean(FEATURE_FLAGS.SUPPORT_NEEDS)

    try {
      const prisonerData = await this.prisonerDetailsService.loadPrisonerDetailsFromParam(req, res)
      handleWhatsNewBanner(req, res)

      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        // Validation failed
        return next(badRequestError('Invalid query parameters'))
      }

      const size = '10'
      const { page = '0', sort = 'occurenceDateTime%2CDESC', days = '0', selectedPathway = 'All' } = req.query
      const { prisonerNumber } = prisonerData.personalDetails

      const promises = [
        ...this.rpService.getPrisonerOverviewPageData(
          prisonerNumber,
          page as string,
          size as string,
          sort as string,
          days as string,
          selectedPathway as string,
        ),
        this.documentService.getDocumentMeta(prisonerNumber),
      ]

      if (supportNeedsEnabled) {
        promises.push(this.rpService.getSupportNeedsSummary(prisonerNumber))
      }

      const [
        licenceConditionsResult,
        riskResult,
        roshResult,
        mappaResult,
        caseNotesResult,
        staffContactsResult,
        appointmentsResult,
        documentsResult,
        supportNeedsResult,
      ] = await Promise.allSettled(promises)

      const licenceConditions = extractResultOrError(licenceConditionsResult, 'licence conditions', req, prisonerNumber)
      const riskScores = extractResultOrError(riskResult, 'risk scores', req, prisonerNumber)
      const rosh = extractResultOrError(roshResult, 'rosh', req, prisonerNumber)
      const mappa = extractResultOrError(mappaResult, 'mappa', req, prisonerNumber)
      const caseNotes = extractResultOrError(caseNotesResult, 'case notes', req, prisonerNumber)
      const staffContacts = extractResultOrError(staffContactsResult, 'staff contacts', req, prisonerNumber)
      const appointments = extractResultsOrErrorList(
        appointmentsResult as PromiseSettledResult<Appointment[]>,
        'appointments',
        req,
        prisonerNumber,
      )
      const documents = extractResultsOrErrorList(
        documentsResult as PromiseSettledResult<DocumentMeta[]>,
        'documents',
        req,
        prisonerNumber,
      )

      let supportNeeds = {}
      if (supportNeedsEnabled) {
        supportNeeds = extractResultOrError(supportNeedsResult, 'support needs', req, prisonerNumber)
      }

      return res.render('pages/overview', {
        licenceConditions,
        prisonerData,
        caseNotes,
        riskScores,
        rosh,
        mappa,
        page,
        size,
        sort,
        days,
        selectedPathway,
        staffContacts,
        appointments,
        documents,
        supportNeeds,
      })
    } catch (err) {
      return next(err)
    }
  }
}

function extractResultOrError<T>(
  result: PromiseSettledResult<unknown>,
  name: string,
  req: Express.Request,
  prisonerNumber: string,
): { error?: boolean } | T {
  if (result.status === 'fulfilled') {
    return result.value
  }
  if (result.status === 'rejected') {
    logger.warn(
      `Session: ${req.sessionID} Cannot retrieve ${name} for ${prisonerNumber} ${result.status} ${result.reason}`,
    )
    return { error: true }
  }
  throw new Error('Should be unreachable')
}

function extractResultsOrErrorList<T>(
  result: PromiseSettledResult<T[]>,
  name: string,
  req: Express.Request,
  prisonerNumber: string,
): ResultListOrError<T> {
  if (result.status === 'fulfilled') {
    return { results: result.value }
  }
  if (result.status === 'rejected') {
    logger.warn(
      `Session: ${req.sessionID} Cannot retrieve ${name} for ${prisonerNumber} ${result.status} ${result.reason}`,
    )
    return { error: ERROR_DICTIONARY.DATA_UNAVAILABLE }
  }
  throw new Error('Should be unreachable')
}

type ResultListOrError<T> = {
  results?: T[]
  error?: string
}

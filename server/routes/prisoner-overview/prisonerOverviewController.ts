import { RequestHandler } from 'express'
import logger from '../../../logger'
import { ERROR_DICTIONARY } from '../../utils/constants'
import DocumentService from '../../services/documentService'
import RpService from '../../services/rpService'
import { Appointment } from '../../data/model/appointment'
import PrisonerDetailsService from '../../services/prisonerDetailsService'
import { handleWhatsNewBanner } from '../whatsNewBanner'
import { DocumentMeta } from '../../data/model/documents'

export default class PrisonerOverviewController {
  constructor(
    private readonly documentService: DocumentService,
    private readonly rpService: RpService,
    private readonly prisonerDetailsService: PrisonerDetailsService,
  ) {
    // no op
  }

  getPrisoner: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const prisonerData = await this.prisonerDetailsService.loadPrisonerDetailsFromParam(req, res)
      handleWhatsNewBanner(req, res)
      const {
        page = '0',
        size = '10',
        sort = 'occurenceDateTime%2CDESC',
        days = '0',
        selectedPathway = 'All',
      } = req.query
      const { prisonerNumber } = prisonerData.personalDetails

      const [
        licenceConditionsResult,
        riskResult,
        roshResult,
        mappaResult,
        caseNotesResult,
        staffContactsResult,
        appointmentsResult,
        documentsResult,
      ] = await Promise.allSettled([
        ...this.rpService.getPrisonerOverviewPageData(
          prisonerNumber,
          page as string,
          size as string,
          sort as string,
          days as string,
          selectedPathway as string,
        ),
        this.documentService.getDocumentMeta(prisonerNumber),
      ])

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

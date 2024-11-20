import { RequestHandler } from 'express'
import logger from '../../../logger'
import { ERROR_DICTIONARY } from '../../utils/constants'
import DocumentService, { DocumentMeta } from '../../services/documentService'
import RpService from '../../services/rpService'
import { Appointment } from '../../data/model/appointment'
import { handleWhatsNewBanner } from '../whatsNew'

export default class PrisonerOverviewController {
  constructor(private readonly documentService: DocumentService, private readonly rpService: RpService) {
    // no op
  }

  getPrisoner: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const { prisonerData } = req
      if (!prisonerData) {
        return next(new Error('No prisoner data found'))
      }
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

      const licenceConditions = extractResultOrError(licenceConditionsResult, 'licence conditions', req)
      const riskScores = extractResultOrError(riskResult, 'risk scores', req)
      const rosh = extractResultOrError(roshResult, 'rosh', req)
      const mappa = extractResultOrError(mappaResult, 'mappa', req)
      const caseNotes = extractResultOrError(caseNotesResult, 'case notes', req)
      const staffContacts = extractResultOrError(staffContactsResult, 'staff contacts', req)
      const appointments = extractResultsOrErrorList(
        appointmentsResult as PromiseSettledResult<Appointment[]>,
        'appointments',
        req,
      )
      const documents = extractResultsOrErrorList(
        documentsResult as PromiseSettledResult<DocumentMeta[]>,
        'documents',
        req,
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
): { error?: boolean } | T {
  if (result.status === 'fulfilled') {
    return result.value
  }
  if (result.status === 'rejected') {
    logger.warn(
      `Session: ${req.sessionID} Cannot retrieve ${name} for ${req.prisonerData.personalDetails.prisonerNumber} ${result.status} ${result.reason}`,
    )
    return { error: true }
  }
  throw new Error('Should be unreachable')
}

function extractResultsOrErrorList<T>(
  result: PromiseSettledResult<T[]>,
  name: string,
  req: Express.Request,
): ResultListOrError<T> {
  if (result.status === 'fulfilled') {
    return { results: result.value }
  }
  if (result.status === 'rejected') {
    logger.warn(
      `Session: ${req.sessionID} Cannot retrieve ${name} for ${req.prisonerData.personalDetails.prisonerNumber} ${result.status} ${result.reason}`,
    )
    return { error: ERROR_DICTIONARY.DATA_UNAVAILABLE }
  }
  throw new Error('Should be unreachable')
}

type ResultListOrError<T> = {
  results?: T[]
  error?: string
}

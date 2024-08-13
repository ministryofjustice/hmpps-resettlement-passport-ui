import { RequestHandler } from 'express'
import { RPClient } from '../../data'
import { Appointments } from '../../data/model/appointment'
import logger from '../../../logger'
import { ERROR_DICTIONARY } from '../../utils/constants'
import DocumentService from '../../services/documentService'

export default class PrisonerOverviewController {
  constructor(private readonly documentService: DocumentService) {
    // no op
  }

  getPrisoner: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const { prisonerData } = req
      const { page = 0, size = 10, sort = 'occurenceDateTime%2CDESC', days = 0, selectedPathway = 'All' } = req.query
      const rpClient = new RPClient(req.user.token, req.sessionID, req.user.username)
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
        rpClient.get(`/resettlement-passport/prisoner/${prisonerNumber}/licence-condition`),
        rpClient.get(`/resettlement-passport/prisoner/${prisonerNumber}/risk/scores`),
        rpClient.get(`/resettlement-passport/prisoner/${prisonerNumber}/risk/rosh`),
        rpClient.get(`/resettlement-passport/prisoner/${prisonerNumber}/risk/mappa`),
        rpClient.get(
          `/resettlement-passport/case-notes/${prisonerNumber}?page=${page}&size=${size}&sort=${sort}&days=${days}&pathwayType=${selectedPathway}`,
        ),
        rpClient.get(`/resettlement-passport/prisoner/${prisonerNumber}/staff-contacts`),
        rpClient
          .get(`/resettlement-passport/prisoner/${prisonerNumber}/appointments`)
          .then((a: Appointments) => a.results),
        this.documentService.getDocumentMeta(prisonerNumber),
      ])

      const licenceConditions = extractResultOrError(licenceConditionsResult, 'licence conditions', req)
      const riskScores = extractResultOrError(riskResult, 'risk scores', req)
      const rosh = extractResultOrError(roshResult, 'rosh', req)
      const mappa = extractResultOrError(mappaResult, 'mappa', req)
      const caseNotes = extractResultOrError(caseNotesResult, 'case notes', req)
      const staffContacts = extractResultOrError(staffContactsResult, 'staff contacts', req)
      const appointments = extractResultsOrErrorList(appointmentsResult, 'appointments', req)
      const documents = extractResultsOrErrorList(documentsResult, 'documents', req)

      res.render('pages/overview', {
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
      next(err)
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

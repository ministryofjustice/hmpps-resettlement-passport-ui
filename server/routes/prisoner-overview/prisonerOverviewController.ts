import { RequestHandler } from 'express'
import RpService from '../../services/rpService'
import { RPClient } from '../../data'
import { Appointments } from '../../data/model/appointment'
import logger from '../../../logger'
import { ERROR_DICTIONARY } from '../../utils/constants'

export default class PrisonerOverviewController {
  constructor(private readonly rpService: RpService) {
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
      ] = await Promise.allSettled([
        rpClient.get(`/resettlement-passport/prisoner/${prisonerNumber}/licence-condition`),
        rpClient.get(`/resettlement-passport/prisoner/${prisonerNumber}/risk/scores`),
        rpClient.get(`/resettlement-passport/prisoner/${prisonerNumber}/risk/rosh`),

        rpClient.get(`/resettlement-passport/prisoner/${prisonerNumber}/risk/mappa`),
        rpClient.get(
          `/resettlement-passport/case-notes/${prisonerNumber}?page=${page}&size=${size}&sort=${sort}&days=${days}&pathwayType=${selectedPathway}`,
        ),
        rpClient.get(`/resettlement-passport/prisoner/${prisonerNumber}/staff-contacts`),
        rpClient.get(`/resettlement-passport/prisoner/${prisonerNumber}/appointments`),
      ])

      const licenceConditions = extractResultOrError(licenceConditionsResult, 'licence conditions', req)
      const riskScores = extractResultOrError(riskResult, 'risk scores', req)
      const rosh = extractResultOrError(roshResult, 'rosh', req)
      const mappa = extractResultOrError(mappaResult, 'mappa', req)
      const caseNotes = extractResultOrError(caseNotesResult, 'case notes', req)
      const staffContacts = extractResultOrError(staffContactsResult, 'staff contacts', req)
      let appointments: Appointments
      if (appointmentsResult.status === 'fulfilled') {
        appointments = appointmentsResult.value
      } else if (appointmentsResult.status === 'rejected') {
        logger.warn(
          `Session: ${req.sessionID} Cannot retrieve appointments for ${prisonerData.personalDetails.prisonerNumber} ${appointmentsResult.status} ${appointmentsResult.reason}`,
        )
        appointments = { error: ERROR_DICTIONARY.DATA_UNAVAILABLE }
      }

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
      })
    } catch (err) {
      next(err)
    }
  }
}

function extractResultOrError(
  result: PromiseSettledResult<unknown>,
  name: string,
  req: Express.Request,
): { error?: boolean } {
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

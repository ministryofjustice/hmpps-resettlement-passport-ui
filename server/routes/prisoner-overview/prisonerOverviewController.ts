import { RequestHandler } from 'express'
import RpService from '../../services/rpService'
import PrisonerOverviewView from './prisonerOverviewView'

export default class PrisonerOverviewController {
  constructor(private readonly rpService: RpService) {}

  getView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerData } = req
    const prisonerId = prisonerData.personalDetails.prisonerNumber as string
    const page = (req.query.page || 0) as number
    const size = (req.query.size || 10) as number
    const sort = (req.query.sort || 'occurenceDateTime%2CDESC') as string
    const days = (req.query.days || 0) as number
    const pathway = (req.query.pathway || 'All') as string
    const { token } = req.user
    const sessionId = req.sessionID

    const licenceConditions = await this.rpService.getLicenceConditions(token, sessionId, prisonerId)
    const riskScores = await this.rpService.getRiskScores(token, sessionId, prisonerId)
    const rosh = await this.rpService.getRosh(token, sessionId, prisonerId)
    const mappa = await this.rpService.getMappa(token, sessionId, prisonerId)
    const caseNotes = await this.rpService.getCaseNotes(token, sessionId, prisonerId, page, size, sort, days, pathway)
    const staffContacts = await this.rpService.getStaffContacts(token, sessionId, prisonerId)
    const appointments = await this.rpService.getAppointments(token, sessionId, prisonerId)

    const view = new PrisonerOverviewView(
      licenceConditions,
      prisonerData,
      caseNotes,
      page,
      size,
      sort,
      days,
      pathway,
      riskScores,
      rosh,
      mappa,
      staffContacts,
      appointments,
    )

    res.render('pages/overview', { ...view.renderArgs })
  }
}

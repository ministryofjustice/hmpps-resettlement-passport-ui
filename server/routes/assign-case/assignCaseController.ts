import { RequestHandler } from 'express'
import RpService from '../../services/rpService'
import AssignCaseView from './assignCaseView'
import { ErrorMessage } from '../view'
import { getFeatureFlagBoolean } from '../../utils/utils'
import { FEATURE_FLAGS } from '../../utils/constants'

export default class AssignCaseController {
  constructor(private readonly rpService: RpService) {
    // no op
  }

  getView: RequestHandler = async (_req, res): Promise<void> => {
    const { userActiveCaseLoad } = res.locals
    const errors: ErrorMessage[] = []

    const includePastReleaseDates = await getFeatureFlagBoolean(FEATURE_FLAGS.INCLUDE_PAST_RELEASE_DATES)
    const [prisonersList, resettlementWorkers] = await Promise.all([
      this.rpService.getListOfPrisonerCases(userActiveCaseLoad.caseLoadId, includePastReleaseDates),
      this.rpService.getAvailableResettlementWorkers(userActiveCaseLoad.caseLoadId),
    ])
    const view = new AssignCaseView(prisonersList, resettlementWorkers, errors)
    return res.render('pages/assign-a-case', { ...view.renderArgs })
  }

  assignCases: RequestHandler = async (req, res): Promise<void> => {
    const chosenPrisoners: string[] | string = req.body.prisonerNumber
    const prisonersToAllocate = Array.isArray(chosenPrisoners) ? chosenPrisoners : [chosenPrisoners]
    const worker = JSON.parse(req.body.worker)
    const assignToId = worker.staffId
    const assignToFirstName = worker.firstName
    const assignToLastName = worker.lastName

    await this.rpService.postCaseAllocations({
      nomsIds: prisonersToAllocate,
      staffId: assignToId,
      staffFirstName: assignToFirstName,
      staffLastName: assignToLastName,
    })
    res.redirect('/assign-a-case')
  }
}

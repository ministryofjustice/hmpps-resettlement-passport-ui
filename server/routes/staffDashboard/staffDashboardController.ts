import { RequestHandler } from 'express'
import PrisonService from '../../services/prisonService'
import StaffDashboardView from './staffDashboardView'
import { ErrorMessage } from '../view'

export default class StaffDashboardController {
  constructor(private readonly prisonService: PrisonService) {}

  getView: RequestHandler = async (req, res, next): Promise<void> => {
    const { token } = req.user
    const { userActiveCaseLoad } = res.locals
    const { searchInput = '' } = req.query as { searchInput: string }

    const errors: ErrorMessage[] = []
    let prisonersList = null

    try {
      // TODO add dynamic pagination and sorting
      prisonersList = await this.prisonService.getListOfPrisoners(
        token,
        userActiveCaseLoad.caseLoadId,
        0,
        200,
        'releaseDate',
        'DESC',
        <string>searchInput,
      )
      const view = new StaffDashboardView(prisonersList, errors, searchInput)
      res.render('pages/staff-dashboard', { ...view.renderArgs })
    } catch (err) {
      next(err)
    }
  }
}

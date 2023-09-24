import { RequestHandler } from 'express'
import PrisonService from '../../services/prisonService'
import StaffDashboardView from './staffDashboardView'
import { ErrorMessage } from '../view'

export default class StaffDashboardController {
  constructor(private readonly prisonService: PrisonService) {}

  getView: RequestHandler = async (req, res, next): Promise<void> => {
    const { token } = req.user
    const { userActiveCaseLoad } = res.locals
    const { searchInput = '', releaseTime = '0' } = req.query as { searchInput: string; releaseTime: string }

    const errors: ErrorMessage[] = []
    let prisonersList = null

    try {
      // TODO add dynamic pagination and sorting
      // Only NOMIS users can access the list prisoners functionality at present
      if (res.locals.user.authSource === 'nomis') {
        prisonersList = await this.prisonService.getListOfPrisoners(
          token,
          userActiveCaseLoad.caseLoadId,
          0,
          200,
          'releaseDate',
          'ASC',
          <string>searchInput,
          <string>releaseTime,
        )
      }
      const view = new StaffDashboardView(prisonersList, errors, searchInput, releaseTime)
      res.render('pages/staff-dashboard', { ...view.renderArgs })
    } catch (err) {
      next(err)
    }
  }
}

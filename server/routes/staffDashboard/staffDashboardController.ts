import { RequestHandler } from 'express'
import PrisonService from '../../services/prisonService'
import logger from '../../../logger'
import StaffDashboardView from './staffDashboardView'
import { ErrorMessage } from '../view'

export default class StaffDashboardController {
  constructor(private readonly prisonService: PrisonService) {}

  getView: RequestHandler = async (req, res, next): Promise<void> => {
    const { token } = req.user
    const { userActiveCaseLoad } = res.locals

    try {
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
        )
      } catch (error) {
        logger.error('Error fetching prisoner list: ', error)
      }

      const view = new StaffDashboardView(prisonersList, errors)
      res.render('pages/staff-dashboard', { ...view.renderArgs })
    } catch (error) {
      const errors = [
        { text: 'Unexpected error - please try again later or contact support if issues persist', href: '#' },
      ]
      logger.error(error, errors)
      res.render('pages/staff-dashboard', { errors })
    }
  }
}

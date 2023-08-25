import { RequestHandler } from 'express'
import PrisonService from '../../services/prisonService'
import logger from '../../../logger'
import StaffDashboardView from './staffDashboardView'
import { ErrorMessage } from '../view'
import { Prison } from '../../data/model/prison'

export default class StaffDashboardController {
  constructor(private readonly prisonService: PrisonService) {}

  getView: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const { prisonSelected } = req.query

      const prisons = await this.prisonService.getListOfPrisons(req.user.token)

      const prisonSelectList = prisons.map((prison: Prison) => {
        return {
          text: prison.name,
          value: prison.id,
          selected: prisonSelected === prison.id,
        }
      })

      prisonSelectList.unshift({
        text: '',
        value: 'unset',
        selected: false,
      })

      const errors: ErrorMessage[] = []

      if (prisonSelected === 'unset') {
        errors.push({
          text: 'You must select a prison',
          href: '#',
        })
      }
      const token = res.locals?.user?.token

      let prisonersList = null
      try {
        // TODO add dynamic pagination and sorting
        prisonersList = await this.prisonService.getListOfPrisoners(
          token,
          `${prisonSelected}`,
          0,
          200,
          'releaseDate',
          'DESC',
        )
      } catch (error) {
        logger.error('Error fetching prisoner list: ', error)
      }

      const view = new StaffDashboardView(prisonSelectList, <string>prisonSelected, prisonersList, errors)
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

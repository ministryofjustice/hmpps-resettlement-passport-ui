import { RequestHandler } from 'express'
import type { HTTPError } from 'superagent'
import PrisonService from '../../services/prisonService'
import logger from '../../../logger'
import StaffDashboardView from './staffDashboardView'
import { ErrorMessage } from '../view'
import { Prison } from '../../data/model/prison'

export default class StaffDashboardController {
  constructor(private readonly prisonService: PrisonService) {}

  getView: RequestHandler = async (req, res, next): Promise<void> => {
    const { token } = req.user

    const errors: ErrorMessage[] = []

    const { prisonSelected } = req.query
    let prisonSelectList = null
    let prisonersList = null

    try {
      const prisons = await this.prisonService.getListOfPrisons(token)
      prisonSelectList = prisons.map((prison: Prison) => {
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

      if (prisonSelected === 'unset') {
        errors.push({
          text: 'You must select a prison',
          href: '#',
        })
      }
    } catch (err) {
      // next(err)
    }

    if (prisonSelected && prisonSelected !== 'unset') {
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
      } catch (e) {
        errors.push({
          text: 'Unexpected error when getting prisoners - please try again later or contact support if issues persist',
          href: '#',
        })
      }
    }

    const view = new StaffDashboardView(prisonSelectList, <string>prisonSelected, prisonersList, errors)
    res.render('pages/staff-dashboard', { ...view.renderArgs })
  }
}

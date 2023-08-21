import { RequestHandler } from 'express'
import PrisonService from '../../services/prisonService'
import logger from '../../../logger'
import StaffDashboardView from './staffDashboardView'
import Prison from '../../data/model'
import { ErrorMessage } from '../view'

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

      /* *******************************
          REFACTOR TO USE RPCLIENT 
      ********************************* */
      const token = res.locals?.user?.token
      // console.log(token)
      const headers = {
        Authorization: `Bearer ${token}`,
      }
      let prisonersList = null
      try {
        const apiResponse = await fetch(
          `https://resettlement-passport-api-dev.hmpps.service.justice.gov.uk/resettlement-passport/prison/${prisonSelected}/prisoners?page=0&size=200&sort=releaseDate,DESC`,
          { headers },
        )
        if (apiResponse.ok) {
          prisonersList = await apiResponse.json()
        }
      } catch (error) {
        logger.error('Error fetching prisoner list:', error)
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

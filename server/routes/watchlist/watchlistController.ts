import { Request, RequestHandler, Response } from 'express'
import RpService from '../../services/rpService'
import logger from '../../../logger'
import PrisonerDetailsService from '../../services/prisonerDetailsService'

export default class WatchlistController {
  constructor(private readonly rpService: RpService, private readonly prisonerDetailsService: PrisonerDetailsService) {
    // no op
  }

  postWatchlist: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      await this.watchlistFlow(req, res, true)
    } catch (error) {
      logger.error(`Session: ${req.sessionID} Error adding to your cases ${error.status} ${error}`)
      next(error)
    }
  }

  deleteWatchlist: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      await this.watchlistFlow(req, res, false)
    } catch (error) {
      logger.error(`Session: ${req.sessionID} Error removing from your cases ${error.status} ${error}`)
      next(error)
    }
  }

  private async watchlistFlow(req: Request, res: Response, addedToYourCase: boolean): Promise<void> {
    const prisonerData = await this.prisonerDetailsService.loadPrisonerDetailsFromParam(req, res, true)
    const errorMessage: string = addedToYourCase ? 'Error adding to your cases' : 'Error removing from your cases'

    try {
      if (addedToYourCase) {
        await this.rpService.postWatchlist(prisonerData.personalDetails.prisonerNumber)
      } else {
        await this.rpService.deleteWatchlist(prisonerData.personalDetails.prisonerNumber)
      }

      res.redirect(`/prisoner-overview/?prisonerNumber=${prisonerData.personalDetails.prisonerNumber}`)
    } catch (err) {
      logger.error(
        `Session: ${req.sessionID} ${errorMessage} ${prisonerData.personalDetails.prisonerNumber} ${err.status} ${err}`,
      )

      res.locals.message = errorMessage
      res.status(err.status || 500)
      res.render('pages/error')
    }
  }
}

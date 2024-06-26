import { Request, RequestHandler, Response } from 'express'
import RpService from '../../services/rpService'
import { RPClient } from '../../data'
import logger from '../../../logger'

export default class WatchlistController {
  constructor(private readonly rpService: RpService) {
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
    const { prisonerData } = req
    const rpClient = new RPClient(req.user.token, req.sessionID, req.user.username)
    const errorMessage: string = addedToYourCase ? 'Error adding to your cases' : 'Error removing from your cases'

    try {
      if (addedToYourCase) {
        await rpClient.post(
          `/resettlement-passport/prisoner/${prisonerData.personalDetails.prisonerNumber}/watch`,
          null,
        )
      } else {
        await rpClient.delete(`/resettlement-passport/prisoner/${prisonerData.personalDetails.prisonerNumber}/watch`)
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

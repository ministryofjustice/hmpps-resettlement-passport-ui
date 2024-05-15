import { RequestHandler } from 'express'
import RpService from '../../services/rpService'
import { RPClient } from '../../data'
import logger from '../../../logger'

export default class WatchlistController {
  constructor(private readonly rpService: RpService) {
    // no op
  }

  postWatchlist: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const { prisonerData } = req
      const rpClient = new RPClient(req.user.token, req.sessionID, req.user.username)
      try {
        await rpClient.post(
          `/resettlement-passport/prisoner/${prisonerData.personalDetails.prisonerNumber}/watch`,
          null,
        )
        res.redirect(`/prisoner-overview/?prisonerNumber=${prisonerData.personalDetails.prisonerNumber}`)
      } catch (err) {
        logger.error(
          `Session: ${req.sessionID} Cannot add to your cases ${prisonerData.personalDetails.prisonerNumber} ${err.status} ${err}`,
        )

        res.locals.message = 'Error adding to your cases'
        res.status(err.status || 500)
        res.render('pages/error')
      }
    } catch (error) {
      logger.error(`Session: ${req.sessionID} Cannot add to your cases ${error.status} ${error}`)
      next(error)
    }
  }
}

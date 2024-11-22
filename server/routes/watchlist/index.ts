import { Router } from 'express'
import { Services } from '../../services'
import WatchlistController from './watchlistController'

export default (router: Router, services: Services) => {
  const watchlistController = new WatchlistController(services.rpService, services.prisonerDetailsService)

  router.post('/addToYourCases/', [watchlistController.postWatchlist])
  router.post('/removeFromYourCases/', [watchlistController.deleteWatchlist])
}

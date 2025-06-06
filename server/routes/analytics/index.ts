import { Router } from 'express'
import AnalyticsController from './analyticsController'
import { Services } from '../../services'

export default (router: Router, services: Services) => {
  const analyticsController = new AnalyticsController(services.appInsightsService)
  router.post('/track', analyticsController.track)
}

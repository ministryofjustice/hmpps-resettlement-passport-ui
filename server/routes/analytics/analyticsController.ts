import { RequestHandler } from 'express'
import { AppInsightsService } from '../../utils/analytics'

export default class AnalyticsController {
  constructor(private readonly appInsightService: AppInsightsService) {
    // no-op
  }

  track: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const { eventName, customTags } = req.body
      const tags = {
        ...customTags,
        sessionId: req.sessionID,
        username: res.locals.user.username,
      }
      if (eventName) {
        this.appInsightService.trackEvent(eventName, tags)
      }
      res.status(200).send()
    } catch (err) {
      next(err)
    }
  }
}

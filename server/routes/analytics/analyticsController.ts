import { RequestHandler } from 'express'
import { TelemetryClient } from 'applicationinsights'
import { trackEvent } from '../../utils/analytics'

export default class AnalyticsController {
  constructor(private readonly appInsightClient: TelemetryClient) {
    // no-op
  }

  track: RequestHandler = async (req, res) => {
    const { eventName, customTags } = req.body
    const tags = {
      ...customTags,
      sessionId: req.sessionID,
      username: res.locals.user.username,
    }
    if (eventName) {
      trackEvent(this.appInsightClient, eventName, tags)
    }
    return res.status(200)
  }
}

import { TelemetryClient } from 'applicationinsights'

// eslint-disable-next-line no-shadow
export enum PsfrEvent {
  STATUS_UPDATE_EVENT = 'PSFR_StatusUpdate',
  PROFILE_RESET_EVENT = 'PSFR_ProfileReset',
  REPORT_SUBMITTED_EVENT = 'PSFR_ReportSubmittedStatusUpdate',
}

export class AppInsightsService {
  constructor(private readonly appInsightsClient: TelemetryClient) {
    // no-op
  }

  trackEvent(name: string, properties: object) {
    if (name) {
      this.appInsightsClient.trackEvent({ name, properties })
      this.appInsightsClient.flush()
    }
  }
}

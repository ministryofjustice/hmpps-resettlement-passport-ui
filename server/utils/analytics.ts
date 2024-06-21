import { TelemetryClient } from 'applicationinsights'

// eslint-disable-next-line no-shadow
export enum PsfrEvent {
  STATUS_UPDATE_EVENT = 'PSFR_StatusUpdate',
}

export type KeyValue = {
  key: string
  value: string
}

export const trackEvent = (appInsightsClient: TelemetryClient, name: string, properties: object) => {
  if (name && appInsightsClient) {
    appInsightsClient.trackEvent({ name, properties })
    appInsightsClient.flush()
  }
}

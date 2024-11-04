import request from 'supertest'
import type { Express } from 'express'
import { TelemetryClient } from 'applicationinsights'
import Config from '../../s3Config'
import { configHelper } from '../configHelperTest'
import { appWithAllRoutes } from '../testutils/appSetup'

let app: Express
let appInsightsClient: jest.Mocked<TelemetryClient>
const config: jest.Mocked<Config> = new Config() as jest.Mocked<Config>

beforeEach(() => {
  configHelper(config)
  jest.mock('applicationinsights', () => jest.fn())
  appInsightsClient = new TelemetryClient('setupString') as jest.Mocked<TelemetryClient>

  app = appWithAllRoutes({
    services: {
      appInsightsClient,
    },
  })
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('track', () => {
  it('Happy path', async () => {
    const trackEventSpy = jest.spyOn(appInsightsClient, 'trackEvent').mockImplementation()
    jest.spyOn(appInsightsClient, 'flush').mockImplementation()

    const name = 'eventName'
    const properties = {
      customTag1: 'tag1',
      customTag2: 'tag2',
      sessionId: 'sessionId',
      username: 'user1',
    }

    await request(app)
      .post(`/track`)
      .send({
        eventName: name,
        customTags: {
          customTag1: 'tag1',
          customTag2: 'tag2',
        },
      })
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot)

    expect(trackEventSpy).toHaveBeenCalledWith({ name, properties })
  })
  it('No request body', async () => {
    const trackEventSpy = jest.spyOn(appInsightsClient, 'trackEvent').mockImplementation()

    await request(app)
      .post(`/track`)
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot)

    expect(trackEventSpy).not.toHaveBeenCalled()
  })
  it('Error from trackEvent', async () => {
    const trackEventSpy = jest.spyOn(appInsightsClient, 'trackEvent').mockImplementationOnce(() => {
      throw new Error('Something went wrong')
    })

    const name = 'eventName'
    const properties = {
      customTag1: 'tag1',
      customTag2: 'tag2',
      sessionId: 'sessionId',
      username: 'user1',
    }

    await request(app)
      .post(`/track`)
      .send({
        eventName: name,
        customTags: {
          customTag1: 'tag1',
          customTag2: 'tag2',
        },
      })
      .expect(500)
      .expect(res => expect(res.text).toMatchSnapshot)

    expect(trackEventSpy).toHaveBeenCalledWith({ name, properties })
  })
  it('Not found Error from trackEvent', async () => {
    const error = new Error('not found') as Error & { status?: number }
    error.status = 404
    const trackEventSpy = jest.spyOn(appInsightsClient, 'trackEvent').mockImplementationOnce(() => {
      throw error
    })
    const name = 'eventName'
    const properties = {
      customTag1: 'tag1',
      customTag2: 'tag2',
      sessionId: 'sessionId',
      username: 'user1',
    }

    await request(app)
      .post(`/track`)
      .send({
        eventName: name,
        customTags: {
          customTag1: 'tag1',
          customTag2: 'tag2',
        },
      })
      .expect(404)
      .expect(res => expect(res.text).toMatchSnapshot)

    expect(trackEventSpy).toHaveBeenCalledWith({ name, properties })
  })
})
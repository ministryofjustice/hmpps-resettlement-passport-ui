import { Request, Response, NextFunction } from 'express'
import * as appInsights from 'applicationinsights'
import { initialiseAppInsights, appInsightsMiddleware } from './azureAppInsights'

jest.mock('applicationinsights')

const initialValue = process.env.APPLICATIONINSIGHTS_CONNECTION_STRING

describe('App Insights', () => {
  beforeAll(() => {
    process.env.APPLICATIONINSIGHTS_CONNECTION_STRING = 'test-connection-string'
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  afterAll(() => {
    process.env.APPLICATIONINSIGHTS_CONNECTION_STRING = initialValue
  })

  describe('initialiseAppInsights', () => {
    it('should set up application insights if connection string is present', () => {
      // eslint-disable-next-line no-console
      console.log = jest.fn()
      const setupMock = appInsights.setup as jest.Mock
      setupMock.mockReturnValue({
        setDistributedTracingMode: jest.fn().mockReturnValue({
          start: jest.fn(),
        }),
      })

      initialiseAppInsights()

      // eslint-disable-next-line no-console
      expect(console.log).toHaveBeenCalledWith('Enabling azure application insights')
      expect(setupMock).toHaveBeenCalled()
    })

    it('should not set up application insights if connection string is not present', () => {
      delete process.env.APPLICATIONINSIGHTS_CONNECTION_STRING
      const setupMock = appInsights.setup as jest.Mock

      initialiseAppInsights()

      expect(setupMock).not.toHaveBeenCalled()
    })
  })

  describe('appInsightsMiddleware', () => {
    it('should set operationName in correlation context on response finish', () => {
      const getCorrelationContextMock = appInsights.getCorrelationContext as jest.Mock
      const setPropertyMock = jest.fn()
      getCorrelationContextMock.mockReturnValue({
        customProperties: {
          setProperty: setPropertyMock,
        },
      })

      const req = {
        method: 'GET',
        route: { path: '/test' },
      } as Request
      const res = {
        prependOnceListener: jest.fn((event, callback) => {
          if (event === 'finish') callback()
        }),
      } as unknown as Response
      const next = jest.fn() as NextFunction

      const middleware = appInsightsMiddleware()
      middleware(req, res, next)

      expect(next).toHaveBeenCalled()
      expect(setPropertyMock).toHaveBeenCalledWith('operationName', 'GET /test')
    })
  })
})

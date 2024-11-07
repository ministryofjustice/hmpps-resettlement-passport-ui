import type { Express } from 'express'
import request from 'supertest'
import NodeClient from 'applicationinsights/out/Library/NodeClient'
import RpService from '../../services/rpService'
import { appWithAllRoutes } from '../testutils/appSetup'
import Config from '../../s3Config'
import FeatureFlags from '../../featureFlag'
import { configHelper } from '../configHelperTest'
import { stubPrisonerDetails } from '../testutils/testUtils'

let app: Express
let rpService: jest.Mocked<RpService>
let appInsightsClient: jest.Mocked<NodeClient>
const config: jest.Mocked<Config> = new Config() as jest.Mocked<Config>
const featureFlags: jest.Mocked<FeatureFlags> = new FeatureFlags() as jest.Mocked<FeatureFlags>

beforeEach(() => {
  rpService = new RpService() as jest.Mocked<RpService>
  appInsightsClient = new NodeClient('setupString') as jest.Mocked<NodeClient>
  configHelper(config)
  app = appWithAllRoutes({
    services: {
      rpService,
      appInsightsClient,
    },
  })

  FeatureFlags.getInstance = jest.fn().mockReturnValue(featureFlags)

  stubPrisonerDetails(rpService)
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('resetProfile', () => {
  it('should render page if feature is enabled', async () => {
    jest.spyOn(featureFlags, 'getFeatureFlags').mockResolvedValue([{ feature: 'profileReset', enabled: true }])
    await request(app)
      .get('/resetProfile?prisonerNumber=123')
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
  })

  it('should not render page if feature is disabled', async () => {
    jest.spyOn(featureFlags, 'getFeatureFlags').mockResolvedValue([{ feature: 'profileReset', enabled: false }])
    await request(app)
      .get('/resetProfile?prisonerNumber=123')
      .expect(500)
      .expect(res => expect(res.text).toMatchSnapshot())
  })

  it('should not render page if prisonerNumber is missing from query string', async () => {
    jest.spyOn(featureFlags, 'getFeatureFlags').mockResolvedValue([{ feature: 'profileReset', enabled: false }])
    await request(app)
      .get('/resetProfile')
      .expect(500)
      .expect(res => expect(res.text).toMatchSnapshot())
  })
})

describe('resetProfileReason', () => {
  it('should render page if feature is enabled and no validation errors', async () => {
    jest.spyOn(featureFlags, 'getFeatureFlags').mockResolvedValue([{ feature: 'profileReset', enabled: true }])
    await request(app)
      .get('/resetProfile/reason?prisonerNumber=123')
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
  })

  it('should not render page if feature is disabled', async () => {
    jest.spyOn(featureFlags, 'getFeatureFlags').mockResolvedValue([{ feature: 'profileReset', enabled: false }])
    await request(app)
      .get('/resetProfile/reason?prisonerNumber=123')
      .expect(500)
      .expect(res => expect(res.text).toMatchSnapshot())
  })

  it('should not render page if prisonerNumber is missing from query string', async () => {
    jest.spyOn(featureFlags, 'getFeatureFlags').mockResolvedValue([{ feature: 'profileReset', enabled: false }])
    await request(app)
      .get('/resetProfile/reason')
      .expect(500)
      .expect(res => expect(res.text).toMatchSnapshot())
  })
})

describe('submitResetProfileReason', () => {
  it('should redirect to success page if feature is enabled and no validation errors - recall', async () => {
    jest.spyOn(featureFlags, 'getFeatureFlags').mockResolvedValue([{ feature: 'profileReset', enabled: true }])
    const trackEventSpy = jest.spyOn(appInsightsClient, 'trackEvent').mockImplementation()
    const flushSpy = jest.spyOn(appInsightsClient, 'flush').mockImplementation()
    const resetProfileSpy = jest.spyOn(rpService, 'resetProfile').mockResolvedValue({ error: null })
    await request(app)
      .post('/resetProfile/reason?prisonerNumber=123')
      .send({
        resetReason: 'RECALL_TO_PRISON',
        additionalDetails: '',
      })
      .expect(302)
      .expect(res => {
        expect(res.text).toContain('Found. Redirecting to /resetProfile/success?prisonerNumber=123')
      })
    expect(resetProfileSpy).toHaveBeenCalledWith('123', { resetReason: 'RECALL_TO_PRISON', additionalDetails: null })
    expect(trackEventSpy).toHaveBeenCalledWith({
      name: 'PSFR_StatusUpdate',
      properties: {
        prisonerId: '123',
        sessionId: 'sessionId',
        reason: 'RECALL_TO_PRISON',
      },
    })
    expect(flushSpy).toHaveBeenCalled()
  })

  it('should redirect to success page if feature is enabled and no validation errors - return', async () => {
    jest.spyOn(featureFlags, 'getFeatureFlags').mockResolvedValue([{ feature: 'profileReset', enabled: true }])
    const resetProfileSpy = jest.spyOn(rpService, 'resetProfile').mockResolvedValue({ error: null })
    await request(app)
      .post('/resetProfile/reason?prisonerNumber=123')
      .send({
        resetReason: 'RETURN_ON_NEW_SENTENCE',
        additionalDetails: '',
      })
      .expect(302)
      .expect(res => {
        expect(res.text).toContain('Found. Redirecting to /resetProfile/success?prisonerNumber=123')
      })
    expect(resetProfileSpy).toHaveBeenCalledWith('123', {
      resetReason: 'RETURN_ON_NEW_SENTENCE',
      additionalDetails: null,
    })
  })

  it('should redirect to success page if feature is enabled and no validation errors - other', async () => {
    jest.spyOn(featureFlags, 'getFeatureFlags').mockResolvedValue([{ feature: 'profileReset', enabled: true }])
    const resetProfileSpy = jest.spyOn(rpService, 'resetProfile').mockResolvedValue({ error: null })
    await request(app)
      .post('/resetProfile/reason?prisonerNumber=123')
      .send({
        resetReason: 'OTHER',
        additionalDetails: 'Some other details',
      })
      .expect(302)
      .expect(res => {
        expect(res.text).toContain('Found. Redirecting to /resetProfile/success?prisonerNumber=123')
      })
    expect(resetProfileSpy).toHaveBeenCalledWith('123', {
      resetReason: 'OTHER',
      additionalDetails: 'Some other details',
    })
  })

  it('should error if feature is disabled', async () => {
    jest.spyOn(featureFlags, 'getFeatureFlags').mockResolvedValue([{ feature: 'profileReset', enabled: false }])
    await request(app)
      .post('/resetProfile/reason?prisonerNumber=123')
      .expect(500)
      .expect(res => expect(res.text).toMatchSnapshot())
  })

  it('should error if call to RP API fails', async () => {
    jest.spyOn(featureFlags, 'getFeatureFlags').mockResolvedValue([{ feature: 'profileReset', enabled: false }])
    jest.spyOn(rpService, 'resetProfile').mockResolvedValue({ error: 'Something went wrong' })
    await request(app)
      .post('/resetProfile/reason?prisonerNumber=123')
      .send({
        resetReason: 'OTHER',
        additionalDetails: 'Some other details',
      })
      .expect(500)
      .expect(res => expect(res.text).toMatchSnapshot())
  })

  it('should not render page if prisonerNumber is missing from query string', async () => {
    jest.spyOn(featureFlags, 'getFeatureFlags').mockResolvedValue([{ feature: 'profileReset', enabled: false }])
    await request(app)
      .post('/resetProfile/reason')
      .expect(500)
      .expect(res => expect(res.text).toMatchSnapshot())
  })

  it('should redirect back to form page if validation fails - mandatory', async () => {
    jest.spyOn(featureFlags, 'getFeatureFlags').mockResolvedValue([{ feature: 'profileReset', enabled: true }])
    await request(app)
      .post('/resetProfile/reason?prisonerNumber=123')
      .send({
        resetReason: null,
        additionalDetails: null,
      })
      .expect(302)
      .expect(res => {
        expect(res.text).toContain('Found. Redirecting to /resetProfile/reason?prisonerNumber=123')
      })
    expect(jest.spyOn(rpService, 'resetProfile')).toHaveBeenCalledTimes(0)
  })

  it('should redirect back to form page if validation fails - mandatory other text', async () => {
    jest.spyOn(featureFlags, 'getFeatureFlags').mockResolvedValue([{ feature: 'profileReset', enabled: true }])
    await request(app)
      .post('/resetProfile/reason?prisonerNumber=123')
      .send({
        resetReason: 'OTHER',
        additionalDetails: '',
      })
      .expect(302)
      .expect(res => {
        expect(res.text).toContain('Found. Redirecting to /resetProfile/reason?prisonerNumber=123')
      })
    expect(jest.spyOn(rpService, 'resetProfile')).toHaveBeenCalledTimes(0)
  })

  it('should redirect back to form page if validation fails - other text too long', async () => {
    jest.spyOn(featureFlags, 'getFeatureFlags').mockResolvedValue([{ feature: 'profileReset', enabled: true }])
    await request(app)
      .post('/resetProfile/reason?prisonerNumber=123')
      .send({
        resetReason: 'OTHER',
        additionalDetails: 'a'.repeat(3001),
      })
      .expect(302)
      .expect(res => {
        expect(res.text).toContain('Found. Redirecting to /resetProfile/reason?prisonerNumber=123')
      })
    expect(jest.spyOn(rpService, 'resetProfile')).toHaveBeenCalledTimes(0)
  })
})

describe('resetProfileSuccess', () => {
  it('should render page if feature is enabled', async () => {
    jest.spyOn(featureFlags, 'getFeatureFlags').mockResolvedValue([{ feature: 'profileReset', enabled: true }])
    await request(app)
      .get('/resetProfile/success?prisonerNumber=123')
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
  })

  it('should not render page if feature is disabled', async () => {
    jest.spyOn(featureFlags, 'getFeatureFlags').mockResolvedValue([{ feature: 'profileReset', enabled: false }])
    await request(app)
      .get('/resetProfile/success?prisonerNumber=123')
      .expect(500)
      .expect(res => expect(res.text).toMatchSnapshot())
  })

  it('should not render page if prisonerNumber is missing from query string', async () => {
    jest.spyOn(featureFlags, 'getFeatureFlags').mockResolvedValue([{ feature: 'profileReset', enabled: false }])
    await request(app)
      .get('/resetProfile/success')
      .expect(500)
      .expect(res => expect(res.text).toMatchSnapshot())
  })
})

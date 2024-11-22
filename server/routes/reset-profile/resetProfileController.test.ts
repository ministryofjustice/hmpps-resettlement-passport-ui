import type { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes, mockedServices } from '../testutils/appSetup'
import Config from '../../s3Config'
import FeatureFlags from '../../featureFlag'
import { configHelper } from '../configHelperTest'
import { pageHeading, parseHtmlDocument, stubPrisonerDetails } from '../testutils/testUtils'

let app: Express
const { rpService, appInsightsService } = mockedServices
const config: jest.Mocked<Config> = new Config() as jest.Mocked<Config>
const featureFlags: jest.Mocked<FeatureFlags> = new FeatureFlags() as jest.Mocked<FeatureFlags>

beforeEach(() => {
  configHelper(config)
  app = appWithAllRoutes({})

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
      .get('/resetProfile?prisonerNumber=A1234DY')
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
  })

  it('should not render page if feature is disabled', async () => {
    jest.spyOn(featureFlags, 'getFeatureFlags').mockResolvedValue([{ feature: 'profileReset', enabled: false }])
    await request(app)
      .get('/resetProfile?prisonerNumber=A1234DY')
      .expect(500)
      .expect(res => expect(res.text).toMatchSnapshot())
  })

  it('should not render page if prisonerNumber is missing from query string', async () => {
    jest.spyOn(featureFlags, 'getFeatureFlags').mockResolvedValue([{ feature: 'profileReset', enabled: false }])
    await request(app)
      .get('/resetProfile')
      .expect(404)
      .expect(res => {
        const document = parseHtmlDocument(res.text)
        expect(pageHeading(document)).toEqual('No data found for prisoner')
      })
  })
})

describe('resetProfileReason', () => {
  it('should render page if feature is enabled and no validation errors', async () => {
    jest.spyOn(featureFlags, 'getFeatureFlags').mockResolvedValue([{ feature: 'profileReset', enabled: true }])
    await request(app)
      .get('/resetProfile/reason?prisonerNumber=A1234DY')
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
  })

  it('should not render page if feature is disabled', async () => {
    jest.spyOn(featureFlags, 'getFeatureFlags').mockResolvedValue([{ feature: 'profileReset', enabled: false }])
    await request(app)
      .get('/resetProfile/reason?prisonerNumber=A1234DY')
      .expect(500)
      .expect(res => expect(res.text).toMatchSnapshot())
  })

  it('should not render page if prisonerNumber is missing from query string', async () => {
    jest.spyOn(featureFlags, 'getFeatureFlags').mockResolvedValue([{ feature: 'profileReset', enabled: false }])
    await request(app)
      .get('/resetProfile/reason?prisonerNumber=123')
      .expect(500)
      .expect(res => expect(res.text).toMatchSnapshot())
  })
})

describe('submitResetProfileReason', () => {
  it('should redirect to success page if feature is enabled and no validation errors - recall', async () => {
    jest.spyOn(featureFlags, 'getFeatureFlags').mockResolvedValue([{ feature: 'profileReset', enabled: true }])
    const trackEventSpy = jest.spyOn(appInsightsService, 'trackEvent').mockImplementation()
    const resetProfileSpy = jest.spyOn(rpService, 'resetProfile').mockResolvedValue({ error: null })
    await request(app)
      .post('/resetProfile/reason?prisonerNumber=A1234DY')
      .send({
        resetReason: 'RECALL_TO_PRISON',
        additionalDetails: '',
        prisonerNumber: '123',
      })
      .expect(302)
      .expect(res => {
        expect(res.text).toContain('Found. Redirecting to /resetProfile/success?prisonerNumber=A1234DY')
      })
    expect(resetProfileSpy).toHaveBeenCalledWith('A1234DY', {
      resetReason: 'RECALL_TO_PRISON',
      additionalDetails: null,
    })
    expect(trackEventSpy).toHaveBeenCalledWith('PSFR_ProfileReset', {
      prisonerId: 'A1234DY',
      sessionId: 'sessionId',
      reason: 'RECALL_TO_PRISON',
    })
  })

  it('should redirect to success page if feature is enabled and no validation errors - return', async () => {
    jest.spyOn(featureFlags, 'getFeatureFlags').mockResolvedValue([{ feature: 'profileReset', enabled: true }])
    const resetProfileSpy = jest.spyOn(rpService, 'resetProfile').mockResolvedValue({ error: null })
    await request(app)
      .post('/resetProfile/reason')
      .send({
        resetReason: 'RETURN_ON_NEW_SENTENCE',
        additionalDetails: '',
        prisonerNumber: 'A1234DY',
      })
      .expect(302)
      .expect(res => {
        expect(res.text).toContain('Found. Redirecting to /resetProfile/success?prisonerNumber=A1234DY')
      })
    expect(resetProfileSpy).toHaveBeenCalledWith('A1234DY', {
      resetReason: 'RETURN_ON_NEW_SENTENCE',
      additionalDetails: null,
    })
  })

  it('should redirect to success page if feature is enabled and no validation errors - other', async () => {
    jest.spyOn(featureFlags, 'getFeatureFlags').mockResolvedValue([{ feature: 'profileReset', enabled: true }])
    const resetProfileSpy = jest.spyOn(rpService, 'resetProfile').mockResolvedValue({ error: null })
    await request(app)
      .post('/resetProfile/reason')
      .send({
        resetReason: 'OTHER',
        additionalDetails: 'Some other details',
        prisonerNumber: 'A1234DY',
      })
      .expect(302)
      .expect(res => {
        expect(res.text).toContain('Found. Redirecting to /resetProfile/success?prisonerNumber=A1234DY')
      })
    expect(resetProfileSpy).toHaveBeenCalledWith('A1234DY', {
      resetReason: 'OTHER',
      additionalDetails: 'Some other details',
    })
  })

  it('should error if feature is disabled', async () => {
    jest.spyOn(featureFlags, 'getFeatureFlags').mockResolvedValue([{ feature: 'profileReset', enabled: false }])
    await request(app)
      .post('/resetProfile/reason?prisonerNumber=A1234DY')
      .expect(500)
      .expect(res => expect(res.text).toMatchSnapshot())
  })

  it('should error if call to RP API fails', async () => {
    jest.spyOn(featureFlags, 'getFeatureFlags').mockResolvedValue([{ feature: 'profileReset', enabled: false }])
    jest.spyOn(rpService, 'resetProfile').mockResolvedValue({ error: 'Something went wrong' })
    await request(app)
      .post('/resetProfile/reason?prisonerNumber=A1234DY')
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
      .post('/resetProfile/reason')
      .send({
        resetReason: null,
        additionalDetails: null,
        prisonerNumber: 'A1234DY',
      })
      .expect(302)
      .expect(res => {
        expect(res.text).toContain('Found. Redirecting to /resetProfile/reason?prisonerNumber=A1234DY')
      })
    expect(jest.spyOn(rpService, 'resetProfile')).toHaveBeenCalledTimes(0)
  })

  it('should redirect back to form page if validation fails - mandatory other text', async () => {
    jest.spyOn(featureFlags, 'getFeatureFlags').mockResolvedValue([{ feature: 'profileReset', enabled: true }])
    await request(app)
      .post('/resetProfile/reason')
      .send({
        resetReason: 'OTHER',
        additionalDetails: '',
        prisonerNumber: 'A1234DY',
      })
      .expect(302)
      .expect(res => {
        expect(res.headers.location).toContain('/resetProfile/reason?prisonerNumber=A1234DY')
      })
    expect(jest.spyOn(rpService, 'resetProfile')).toHaveBeenCalledTimes(0)
  })

  it('should redirect back to form page if validation fails - other text too long', async () => {
    jest.spyOn(featureFlags, 'getFeatureFlags').mockResolvedValue([{ feature: 'profileReset', enabled: true }])
    await request(app)
      .post('/resetProfile/reason')
      .send({
        resetReason: 'OTHER',
        additionalDetails: 'a'.repeat(3001),
        prisonerNumber: 'A1234DY',
      })
      .expect(302)
      .expect(res => {
        expect(res.headers.location).toContain('/resetProfile/reason?prisonerNumber=A1234DY')
      })
    expect(jest.spyOn(rpService, 'resetProfile')).toHaveBeenCalledTimes(0)
  })
})

describe('resetProfileSuccess', () => {
  it('should render page if feature is enabled', async () => {
    jest.spyOn(featureFlags, 'getFeatureFlags').mockResolvedValue([{ feature: 'profileReset', enabled: true }])
    await request(app)
      .get('/resetProfile/success?prisonerNumber=A1234DY')
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
  })

  it('should not render page if feature is disabled', async () => {
    jest.spyOn(featureFlags, 'getFeatureFlags').mockResolvedValue([{ feature: 'profileReset', enabled: false }])
    await request(app)
      .get('/resetProfile/success?prisonerNumber=A1234DY')
      .expect(500)
      .expect(res => expect(res.text).toMatchSnapshot())
  })

  it('should not render page if prisonerNumber is missing from query string', async () => {
    jest.spyOn(featureFlags, 'getFeatureFlags').mockResolvedValue([{ feature: 'profileReset', enabled: false }])
    await request(app)
      .get('/resetProfile/success')
      .expect(404)
      .expect(res => {
        const document = parseHtmlDocument(res.text)
        expect(pageHeading(document)).toEqual('No data found for prisoner')
      })
  })
})

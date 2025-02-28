import type { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes, mockedServices } from '../testutils/appSetup'
import Config from '../../s3Config'
import FeatureFlags from '../../featureFlag'
import { configHelper } from '../configHelperTest'
import {
  expectPrisonerNotFoundPage,
  expectSomethingWentWrongPage,
  stubFeatureFlagToFalse,
  stubFeatureFlagToTrue,
  stubPrisonerDetails,
} from '../testutils/testUtils'
import { Services } from '../../services'

let app: Express
const { rpService, appInsightsService } = mockedServices as Services
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
    stubFeatureFlagToTrue(featureFlags, ['profileReset'])
    await request(app)
      .get('/resetProfile?prisonerNumber=A1234DY')
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
  })

  it('should not render page if feature is disabled', async () => {
    stubFeatureFlagToFalse(featureFlags)
    await request(app)
      .get('/resetProfile?prisonerNumber=A1234DY')
      .expect(500)
      .expect(res => expect(res.text).toMatchSnapshot())
  })

  it('should not render page if prisonerNumber is missing from query string', async () => {
    stubFeatureFlagToFalse(featureFlags)
    await request(app)
      .get('/resetProfile')
      .expect(404)
      .expect(res => expectPrisonerNotFoundPage(res))
  })
})

describe('resetProfile', () => {
  it('should render different content if supportNeeds flag is enabled', async () => {
    stubFeatureFlagToTrue(featureFlags, ['profileReset', 'supportNeeds'])
    await request(app)
      .get('/resetProfile?prisonerNumber=A1234DY')
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
  })
})

describe('resetProfileReason', () => {
  it('should render page if feature is enabled and no validation errors', async () => {
    stubFeatureFlagToTrue(featureFlags, ['profileReset'])
    await request(app)
      .get('/resetProfile/reason?prisonerNumber=A1234DY')
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
  })

  it('should not render page if feature is disabled', async () => {
    stubFeatureFlagToFalse(featureFlags)
    await request(app)
      .get('/resetProfile/reason?prisonerNumber=A1234DY')
      .expect(500)
      .expect(res => expect(res.text).toMatchSnapshot())
  })

  it('should not render page if prisonerNumber is missing from query string', async () => {
    stubFeatureFlagToFalse(featureFlags)
    await request(app)
      .get('/resetProfile/reason?prisonerNumber=123')
      .expect(500)
      .expect(res => expect(res.text).toMatchSnapshot())
  })
})

describe('resetProfileReason', () => {
  it('should render resetProfileReason page with different content if supportNeeds flags enabled', async () => {
    stubFeatureFlagToTrue(featureFlags, ['profileReset', 'supportNeeds'])
    await request(app)
      .get('/resetProfile/reason?prisonerNumber=A1234DY')
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
  })
})

describe('submitResetProfileReason', () => {
  it('should redirect to success page if feature is enabled and no validation errors - recall', async () => {
    stubFeatureFlagToTrue(featureFlags, ['profileReset'])
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
    expect(resetProfileSpy).toHaveBeenCalledWith(
      'A1234DY',
      {
        resetReason: 'RECALL_TO_PRISON',
        additionalDetails: null,
      },
      false,
    )
    expect(trackEventSpy).toHaveBeenCalledWith('PSFR_ProfileReset', {
      prisonerId: 'A1234DY',
      sessionId: 'sessionId',
      reason: 'RECALL_TO_PRISON',
    })
  })

  it('should redirect to success page if feature is enabled and no validation errors - return', async () => {
    stubFeatureFlagToTrue(featureFlags, ['profileReset'])
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
    expect(resetProfileSpy).toHaveBeenCalledWith(
      'A1234DY',
      {
        resetReason: 'RETURN_ON_NEW_SENTENCE',
        additionalDetails: null,
      },
      false,
    )
  })

  it('should redirect to success page if feature is enabled and no validation errors - other', async () => {
    stubFeatureFlagToTrue(featureFlags, ['profileReset'])
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
    expect(resetProfileSpy).toHaveBeenCalledWith(
      'A1234DY',
      {
        resetReason: 'OTHER',
        additionalDetails: 'Some other details',
      },
      false,
    )
  })

  it('should redirect to success page if feature is enabled and supportNeeds enabled and no validation errors', async () => {
    stubFeatureFlagToTrue(featureFlags, ['profileReset', 'supportNeeds'])
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
    expect(resetProfileSpy).toHaveBeenCalledWith(
      'A1234DY',
      {
        resetReason: 'RETURN_ON_NEW_SENTENCE',
        additionalDetails: null,
      },
      true,
    )
  })

  it('should error if feature is disabled', async () => {
    stubFeatureFlagToFalse(featureFlags)
    await request(app)
      .post('/resetProfile/reason?prisonerNumber=A1234DY')
      .expect(500)
      .expect(res => expect(res.text).toMatchSnapshot())
  })

  it('should error if call to RP API fails', async () => {
    stubFeatureFlagToFalse(featureFlags)
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
    stubFeatureFlagToFalse(featureFlags)
    await request(app)
      .post('/resetProfile/reason')
      .expect(500)
      .expect(res => expect(res.text).toMatchSnapshot())
  })

  it('should redirect back to form page if validation fails - mandatory', async () => {
    stubFeatureFlagToTrue(featureFlags, ['profileReset'])
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
    stubFeatureFlagToTrue(featureFlags, ['profileReset'])
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
    stubFeatureFlagToTrue(featureFlags, ['profileReset'])
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
    stubFeatureFlagToTrue(featureFlags, ['profileReset'])
    await request(app)
      .get('/resetProfile/success?prisonerNumber=A1234DY')
      .expect(200)
      .expect(res => expect(res.text).toMatchSnapshot())
  })

  it('should not render page if feature is disabled', async () => {
    stubFeatureFlagToFalse(featureFlags)
    await request(app)
      .get('/resetProfile/success?prisonerNumber=A1234DY')
      .expect(500)
      .expect(res => expectSomethingWentWrongPage(res))
  })

  it('should not render page if prisonerNumber is missing from query string', async () => {
    stubFeatureFlagToFalse(featureFlags)
    await request(app)
      .get('/resetProfile/success')
      .expect(404)
      .expect(res => expectPrisonerNotFoundPage(res))
  })
})

import { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes, mockedServices } from '../testutils/appSetup'
import { Services } from '../../services'
import FeatureFlags from '../../featureFlag'
import {
  stubFeatureFlagToFalse,
  stubFeatureFlagToTrue,
  stubPathwaySupportNeeds,
  stubPathwaySupportNeedsSummary,
  stubPrisonerDetails,
} from '../testutils/testUtils'
import { configHelper } from '../configHelperTest'
import Config from '../../s3Config'

let app: Express
const featureFlags: jest.Mocked<FeatureFlags> = new FeatureFlags() as jest.Mocked<FeatureFlags>
const config: jest.Mocked<Config> = new Config() as jest.Mocked<Config>
const { supportNeedStateService, rpService } = mockedServices as Services

beforeEach(() => {
  configHelper(config)

  app = appWithAllRoutes({ production: false })

  FeatureFlags.getInstance = jest.fn().mockReturnValue(featureFlags)
  stubFeatureFlagToTrue(featureFlags, ['supportNeeds'])

  stubPrisonerDetails(rpService)
  stubPathwaySupportNeeds(rpService)
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('SupportNeedsController', () => {
  describe('checkLegacyProfile', () => {
    describe('when a profile is a legacy profile', () => {
      beforeEach(() => {
        stubPrisonerDetails(rpService, null, null, true)
      })

      const legacyErrorText = 'Unable to access support needs for a legacy profile'

      it('should throw an error for the start route', async () => {
        await request(app)
          .get('/support-needs/accommodation/start/?prisonerNumber=A1234DY')
          .expect(500)
          .then(res => {
            expect(res.text).toContain(legacyErrorText)
          })
      })

      it('should throw an error for the get support needs route', async () => {
        await request(app)
          .get('/support-needs/accommodation/?prisonerNumber=A1234DY')
          .expect(500)
          .then(res => {
            expect(res.text).toContain(legacyErrorText)
          })
      })

      it('should throw an error for the submit support needs route', async () => {
        await request(app)
          .post('/support-needs/accommodation')
          .send({
            prisonerNumber: 'A1234DY',
          })
          .expect(500)
          .then(res => {
            expect(res.text).toContain(legacyErrorText)
          })
      })

      it('should throw an error for the get support needs status route', async () => {
        await request(app)
          .get('/support-needs/accommodation/status/need-uuid/?prisonerNumber=A1234DY')
          .expect(500)
          .then(res => {
            expect(res.text).toContain(legacyErrorText)
          })
      })

      it('should throw an error for the submit support needs status route', async () => {
        await request(app)
          .post('/support-needs/accommodation/status/need-uuid')
          .send({
            prisonerNumber: 'A1234DY',
          })
          .expect(500)
          .then(res => {
            expect(res.text).toContain(legacyErrorText)
          })
      })

      it('should throw an error for the check answers route', async () => {
        await request(app)
          .get('/support-needs/accommodation/check-answers/?prisonerNumber=A1234DY')
          .expect(500)
          .then(res => {
            expect(res.text).toContain(legacyErrorText)
          })
      })

      it('should throw an error for finalise support needs route', async () => {
        await request(app)
          .post('/support-needs/accommodation/complete')
          .send({
            _csrf: 'xjM2bce6',
            prisonerNumber: 'A8731DY',
          })
          .expect(500)
          .then(res => {
            expect(res.text).toContain(legacyErrorText)
          })
      })

      it('should gracefully handle unexpected errors', async () => {
        jest.spyOn(rpService, 'getPrisonerDetails').mockRejectedValue(new Error('Something went wrong'))
        await request(app)
          .get('/support-needs/accommodation/?prisonerNumber=A1234DY')
          .expect(500)
          .then(res => {
            expect(res.text).toContain('Something went wrong')
          })
      })
    })
  })

  describe('resetSupportNeedsCache', () => {
    it('should throw an error if pathway is invalid', async () => {
      await request(app).get('/support-needs/invalid-pathway/start/?prisonerNumber=A1234DY').expect(500)
    })

    it('should throw an error if supportNeeds feature is off', async () => {
      stubFeatureFlagToFalse(featureFlags)
      await request(app).get('/support-needs/accommodation/start/?prisonerNumber=A1234DY').expect(500)
    })

    it('should delete the support needs cache and redirect', async () => {
      const mockUUID = 'some-fixed-uuid-instead-of-generated-uuid'
      jest.spyOn(supportNeedStateService, 'deleteSupportNeeds').mockImplementation()
      jest.spyOn(crypto, 'randomUUID').mockReturnValue(mockUUID)

      await request(app)
        .get('/support-needs/accommodation/start/?prisonerNumber=A1234DY')
        .expect(302)
        .expect('Location', '/support-needs/accommodation/?prisonerNumber=A1234DY')

      const stateKey = {
        prisonerNumber: 'A1234DY',
        userId: 'user1',
        pathway: 'ACCOMMODATION',
      }

      expect(supportNeedStateService.deleteSupportNeeds).toHaveBeenCalledWith(stateKey)

      expect(supportNeedStateService.setSupportNeeds).toHaveBeenCalledWith(stateKey, {
        needs: [
          {
            uuid: mockUUID,
            supportNeedId: 1,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: false,
            category: 'Accommodation before custody',
            isOther: false,
            title: 'End a tenancy',
            isUpdatable: true,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: null,
            isPreSelected: false,
          },
          {
            uuid: mockUUID,
            supportNeedId: 2,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: false,
            category: 'Accommodation before custody',
            isOther: false,
            title: 'Maintain a tenancy while in prison',
            isUpdatable: true,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: null,
            isPreSelected: false,
          },
          {
            uuid: mockUUID,
            supportNeedId: 3,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: false,
            category: 'Accommodation before custody',
            isOther: false,
            title: 'Mortgage support while in prison',
            isUpdatable: true,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: null,
            isPreSelected: false,
          },
          {
            uuid: mockUUID,
            supportNeedId: 4,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: false,
            category: 'Accommodation before custody',
            isOther: false,
            title:
              'Home adaptations to stay in current accommodation (changes to make it safer and easier to move around and do everyday tasks)',
            isUpdatable: true,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: null,
            isPreSelected: false,
          },
          {
            uuid: mockUUID,
            supportNeedId: 5,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: false,
            category: 'Accommodation before custody',
            isOther: false,
            title: 'Arrange storage for personal possessions while in prison',
            isUpdatable: true,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: null,
            isPreSelected: false,
          },
          {
            uuid: mockUUID,
            supportNeedId: 6,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: true,
            category: 'Accommodation before custody',
            isOther: false,
            title: 'Other',
            isUpdatable: true,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: null,
            isPreSelected: false,
          },
          {
            uuid: mockUUID,
            supportNeedId: 7,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: false,
            category: 'Accommodation before custody',
            isOther: false,
            title: 'No accommodation before custody support needs identified',
            isUpdatable: false,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: null,
            isPreSelected: false,
          },
          {
            uuid: mockUUID,
            supportNeedId: 8,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: false,
            category: 'Moving to new accommodation',
            isOther: false,
            title: 'Help to find accommodation',
            isUpdatable: true,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: null,
            isPreSelected: false,
          },
          {
            uuid: mockUUID,
            supportNeedId: 9,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: false,
            category: 'Moving to new accommodation',
            isOther: false,
            title:
              'Home adaptations needed for new accommodation (changes to make it safer and easier to move around and do everyday tasks)',
            isUpdatable: true,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: null,
            isPreSelected: false,
          },
          {
            uuid: mockUUID,
            supportNeedId: 10,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: true,
            category: 'Moving to new accommodation',
            isOther: false,
            title: 'Other',
            isUpdatable: true,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: null,
            isPreSelected: false,
          },
          {
            uuid: mockUUID,
            supportNeedId: 11,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: false,
            category: 'Moving to new accommodation',
            isOther: false,
            title: 'No new accommodation support needs identified',
            isUpdatable: false,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: null,
            isPreSelected: false,
          },
          {
            uuid: mockUUID,
            supportNeedId: 12,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: false,
            category: 'Accommodation related debt and arrears',
            isOther: false,
            title: 'Set up payment for rent arrears',
            isUpdatable: true,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: null,
            isPreSelected: false,
          },
          {
            uuid: mockUUID,
            supportNeedId: 13,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: false,
            category: 'Accommodation related debt and arrears',
            isOther: false,
            title: 'Ensure accommodation related debt or arrears do not build up',
            isUpdatable: true,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: null,
            isPreSelected: false,
          },
          {
            uuid: mockUUID,
            supportNeedId: 14,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: true,
            category: 'Accommodation related debt and arrears',
            isOther: false,
            title: 'Other',
            isUpdatable: true,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: null,
            isPreSelected: false,
          },
          {
            uuid: mockUUID,
            supportNeedId: 15,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: false,
            category: 'Accommodation related debt and arrears',
            isOther: false,
            title: 'No accommodation related debt and arrears support needs identified',
            isUpdatable: false,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: null,
            isPreSelected: true,
          },
        ],
      })
    })
  })

  describe('getSupportNeeds', () => {
    beforeEach(() => {
      jest.spyOn(supportNeedStateService, 'getSupportNeeds').mockResolvedValue({
        needs: [
          {
            uuid: '0a78acb7-0e7d-4ec0-8b73-29af627db9ec',
            supportNeedId: 1,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: false,
            category: 'Accommodation before custody',
            isOther: false,
            title: 'End a tenancy',
            isUpdatable: true,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: null,
            isPreSelected: false,
          },
          {
            uuid: 'e8b52c96-33e9-420b-ab1e-e1ace2e1f953',
            supportNeedId: 2,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: false,
            category: 'Accommodation before custody',
            isOther: false,
            title: 'Maintain a tenancy while in prison',
            isUpdatable: true,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: null,
            isPreSelected: false,
          },
          {
            uuid: '8442e4b7-82b9-4127-b746-42a3f8d78cb8',
            supportNeedId: 3,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: false,
            category: 'Accommodation before custody',
            isOther: false,
            title: 'Mortgage support while in prison',
            isUpdatable: true,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: null,
            isPreSelected: false,
          },
          {
            uuid: '622b3deb-03ff-4cfb-8555-978f1b5b0793',
            supportNeedId: 4,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: false,
            category: 'Accommodation before custody',
            isOther: false,
            title:
              'Home adaptations to stay in current accommodation (changes to make it safer and easier to move around and do everyday tasks)',
            isUpdatable: true,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: null,
            isPreSelected: false,
          },
          {
            uuid: '8176f4fb-735c-45e6-bfc3-cf8833b08a83',
            supportNeedId: 5,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: false,
            category: 'Accommodation before custody',
            isOther: false,
            title: 'Arrange storage for personal possessions while in prison',
            isUpdatable: true,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: null,
            isPreSelected: false,
          },
          {
            uuid: 'f3dc52b8-5b5e-4bad-8411-d8291e110169',
            supportNeedId: 6,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: true,
            category: 'Accommodation before custody',
            isOther: true,
            title: 'Other',
            isUpdatable: true,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: 'Some custom support need',
            status: null,
            updateText: null,
            isSelected: null,
            isPreSelected: false,
          },
          {
            uuid: '20172ff2-0c21-4485-9402-5acf2cb60809',
            supportNeedId: 7,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: false,
            category: 'Accommodation before custody',
            isOther: false,
            title: 'No accommodation before custody support needs identified',
            isUpdatable: false,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: null,
            isPreSelected: false,
          },
          {
            uuid: '33c32185-3ae1-40a5-a1fd-0872230c7343',
            supportNeedId: 8,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: false,
            category: 'Moving to new accommodation',
            isOther: false,
            title: 'Help to find accommodation',
            isUpdatable: true,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: null,
            isPreSelected: false,
          },
          {
            uuid: '531b4b31-a5ed-48cc-87ff-ac933e65b7fa',
            supportNeedId: 9,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: false,
            category: 'Moving to new accommodation',
            isOther: false,
            title:
              'Home adaptations needed for new accommodation (changes to make it safer and easier to move around and do everyday tasks)',
            isUpdatable: true,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: null,
            isPreSelected: false,
          },
          {
            uuid: '661f221e-defd-48e3-895a-2b09cf216108',
            supportNeedId: 10,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: true,
            category: 'Moving to new accommodation',
            isOther: false,
            title: 'Other',
            isUpdatable: true,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: null,
            isPreSelected: false,
          },
          {
            uuid: '7175a5b9-c1b5-434a-b47b-d1c7ea39fa33',
            supportNeedId: 11,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: false,
            category: 'Moving to new accommodation',
            isOther: false,
            title: 'No new accommodation support needs identified',
            isUpdatable: false,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: null,
            isPreSelected: false,
          },
          {
            uuid: 'af889df2-d8cd-475d-b25b-70fd9421ed11',
            supportNeedId: 12,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: false,
            category: 'Accommodation related debt and arrears',
            isOther: false,
            title: 'Set up payment for rent arrears',
            isUpdatable: true,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: null,
            isPreSelected: false,
          },
          {
            uuid: '329dbffb-de74-4cb5-8e36-4562218ecffe',
            supportNeedId: 13,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: false,
            category: 'Accommodation related debt and arrears',
            isOther: false,
            title: 'Ensure accommodation related debt or arrears do not build up',
            isUpdatable: true,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: null,
            isPreSelected: false,
          },
          {
            uuid: '6ae72705-5a29-4f65-aa05-65ba00a9e5b1',
            supportNeedId: 14,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: true,
            category: 'Accommodation related debt and arrears',
            isOther: false,
            title: 'Other',
            isUpdatable: true,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: null,
            isPreSelected: false,
          },
          {
            uuid: '574fc882-0528-4754-aeeb-1b4a04a44912',
            supportNeedId: 15,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: false,
            category: 'Accommodation related debt and arrears',
            isOther: false,
            title: 'No accommodation related debt and arrears support needs identified',
            isUpdatable: false,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: null,
            isPreSelected: true,
          },
        ],
      })
    })

    it('should throw an error if pathway is invalid', async () => {
      await request(app).get('/support-needs/invalid-pathway/?prisonerNumber=A1234DY').expect(500)
    })

    it('should throw an error if supportNeeds feature is off', async () => {
      stubFeatureFlagToFalse(featureFlags)
      await request(app).get('/support-needs/accommodation/?prisonerNumber=A1234DY').expect(500)
    })

    it('should throw an error if getPathwaySupportNeedsSummary API call fails', async () => {
      jest.spyOn(rpService, 'getPathwaySupportNeedsSummary').mockRejectedValue(new Error('something went wrong'))

      await request(app).get('/support-needs/invalid-pathway/?prisonerNumber=A1234DY').expect(500)
    })

    it('should render the support needs page with previous support needs', async () => {
      stubPathwaySupportNeedsSummary(rpService)

      await request(app)
        .get('/support-needs/accommodation/?prisonerNumber=A1234DY')
        .expect(200)
        .expect(res => {
          expect(res.text).toMatchSnapshot()
        })

      const stateKey = {
        prisonerNumber: 'A1234DY',
        userId: 'user1',
        pathway: 'ACCOMMODATION',
      }

      expect(supportNeedStateService.getSupportNeeds).toHaveBeenCalledWith(stateKey)
    })

    it('should render the support needs page without previous support needs', async () => {
      jest.spyOn(rpService, 'getPathwaySupportNeedsSummary').mockResolvedValue(null)

      await request(app)
        .get('/support-needs/accommodation/?prisonerNumber=A1234DY')
        .expect(200)
        .expect(res => {
          expect(res.text).toMatchSnapshot()
        })
    })
  })

  describe('submitSupportNeeds', () => {
    it('should redirect to the support needs page of the first selected supportNeed which isUpdatable', async () => {
      jest.spyOn(supportNeedStateService, 'getSupportNeeds').mockResolvedValue({
        needs: [
          {
            uuid: 'uuid-of-supportNeed-is-updatable',
            supportNeedId: 1,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: false,
            category: 'Accommodation before custody',
            isOther: false,
            title: 'End a tenancy',
            isUpdatable: true,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: null,
            isPreSelected: false,
          },
          {
            uuid: 'second-uuid-of-supportNeed-is-updatable',
            supportNeedId: 2,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: false,
            category: 'Accommodation before custody',
            isOther: false,
            title: 'Maintain a tenancy while in prison',
            isUpdatable: true,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: null,
            isPreSelected: false,
          },
          {
            uuid: '8442e4b7-82b9-4127-b746-42a3f8d78cb8',
            supportNeedId: 3,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: false,
            category: 'Accommodation before custody',
            isOther: false,
            title: 'Mortgage support while in prison',
            isUpdatable: true,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: null,
            isPreSelected: false,
          },
          {
            uuid: '622b3deb-03ff-4cfb-8555-978f1b5b0793',
            supportNeedId: 4,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: false,
            category: 'Accommodation before custody',
            isOther: false,
            title:
              'Home adaptations to stay in current accommodation (changes to make it safer and easier to move around and do everyday tasks)',
            isUpdatable: true,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: null,
            isPreSelected: false,
          },
          {
            uuid: '8176f4fb-735c-45e6-bfc3-cf8833b08a83',
            supportNeedId: 5,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: false,
            category: 'Accommodation before custody',
            isOther: false,
            title: 'Arrange storage for personal possessions while in prison',
            isUpdatable: true,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: null,
            isPreSelected: false,
          },
          {
            uuid: 'f3dc52b8-5b5e-4bad-8411-d8291e110169',
            supportNeedId: 6,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: true,
            category: 'Accommodation before custody',
            isOther: false,
            title: 'Other',
            isUpdatable: true,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: null,
            isPreSelected: false,
          },
          {
            uuid: '20172ff2-0c21-4485-9402-5acf2cb60809',
            supportNeedId: 7,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: false,
            category: 'Accommodation before custody',
            isOther: false,
            title: 'No accommodation before custody support needs identified',
            isUpdatable: false,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: null,
            isPreSelected: false,
          },
          {
            uuid: '33c32185-3ae1-40a5-a1fd-0872230c7343',
            supportNeedId: 8,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: false,
            category: 'Moving to new accommodation',
            isOther: false,
            title: 'Help to find accommodation',
            isUpdatable: true,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: null,
            isPreSelected: false,
          },
          {
            uuid: '531b4b31-a5ed-48cc-87ff-ac933e65b7fa',
            supportNeedId: 9,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: false,
            category: 'Moving to new accommodation',
            isOther: false,
            title:
              'Home adaptations needed for new accommodation (changes to make it safer and easier to move around and do everyday tasks)',
            isUpdatable: true,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: null,
            isPreSelected: false,
          },
          {
            uuid: '661f221e-defd-48e3-895a-2b09cf216108',
            supportNeedId: 10,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: true,
            category: 'Moving to new accommodation',
            isOther: false,
            title: 'Other',
            isUpdatable: true,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: null,
            isPreSelected: false,
          },
          {
            uuid: 'uuid-of-supportNeed-not-updatable',
            supportNeedId: 11,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: false,
            category: 'Moving to new accommodation',
            isOther: false,
            title: 'No new accommodation support needs identified',
            isUpdatable: false,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: null,
            isPreSelected: false,
          },
          {
            uuid: 'third-uuid-of-supportNeed-is-updatable',
            supportNeedId: 12,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: false,
            category: 'Accommodation related debt and arrears',
            isOther: false,
            title: 'Set up payment for rent arrears',
            isUpdatable: true,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: null,
            isPreSelected: false,
          },
          {
            uuid: '329dbffb-de74-4cb5-8e36-4562218ecffe',
            supportNeedId: 13,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: false,
            category: 'Accommodation related debt and arrears',
            isOther: false,
            title: 'Ensure accommodation related debt or arrears do not build up',
            isUpdatable: true,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: null,
            isPreSelected: false,
          },
          {
            uuid: '6ae72705-5a29-4f65-aa05-65ba00a9e5b1',
            supportNeedId: 14,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: true,
            category: 'Accommodation related debt and arrears',
            isOther: false,
            title: 'Other',
            isUpdatable: true,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: null,
            isPreSelected: false,
          },
          {
            uuid: '574fc882-0528-4754-aeeb-1b4a04a44912',
            supportNeedId: 15,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: false,
            category: 'Accommodation related debt and arrears',
            isOther: false,
            title: 'No accommodation related debt and arrears support needs identified',
            isUpdatable: false,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: null,
            isPreSelected: false,
          },
        ],
      })

      await request(app)
        .post('/support-needs/accommodation')
        .send({
          'support-need-option-Moving to new accommodation': 'uuid-of-supportNeed-not-updatable',
          'support-need-option-Accommodation before custody': [
            'uuid-of-supportNeed-is-updatable',
            'second-uuid-of-supportNeed-is-updatable',
          ],
          'support-need-option-Accommodation related debt and arrears': 'third-uuid-of-supportNeed-is-updatable',
          _csrf: 'xjM2bce6',
          prisonerNumber: 'A8731DY',
        })
        .expect(302)
        .expect(
          'Location',
          '/support-needs/accommodation/status/uuid-of-supportNeed-is-updatable/?prisonerNumber=A1234DY',
        )
    })

    it('should redirect to the check answers page if no supportNeed isUpdatable', async () => {
      jest.spyOn(supportNeedStateService, 'getSupportNeeds').mockResolvedValue({
        needs: [
          {
            uuid: 'uuid-of-supportNeed-is-updatable',
            supportNeedId: 1,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: false,
            category: 'Accommodation before custody',
            isOther: false,
            title: 'End a tenancy',
            isUpdatable: true,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: null,
            isPreSelected: false,
          },
          {
            uuid: 'second-uuid-of-supportNeed-is-updatable',
            supportNeedId: 2,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: false,
            category: 'Accommodation before custody',
            isOther: false,
            title: 'Maintain a tenancy while in prison',
            isUpdatable: true,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: null,
            isPreSelected: false,
          },
          {
            uuid: '8442e4b7-82b9-4127-b746-42a3f8d78cb8',
            supportNeedId: 3,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: false,
            category: 'Accommodation before custody',
            isOther: false,
            title: 'Mortgage support while in prison',
            isUpdatable: true,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: null,
            isPreSelected: false,
          },
          {
            uuid: '622b3deb-03ff-4cfb-8555-978f1b5b0793',
            supportNeedId: 4,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: false,
            category: 'Accommodation before custody',
            isOther: false,
            title:
              'Home adaptations to stay in current accommodation (changes to make it safer and easier to move around and do everyday tasks)',
            isUpdatable: true,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: null,
            isPreSelected: false,
          },
          {
            uuid: '8176f4fb-735c-45e6-bfc3-cf8833b08a83',
            supportNeedId: 5,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: false,
            category: 'Accommodation before custody',
            isOther: false,
            title: 'Arrange storage for personal possessions while in prison',
            isUpdatable: true,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: null,
            isPreSelected: false,
          },
          {
            uuid: 'f3dc52b8-5b5e-4bad-8411-d8291e110169',
            supportNeedId: 6,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: true,
            category: 'Accommodation before custody',
            isOther: false,
            title: 'Other',
            isUpdatable: true,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: null,
            isPreSelected: false,
          },
          {
            uuid: 'selected-no-need-identified-1',
            supportNeedId: 7,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: false,
            category: 'Accommodation before custody',
            isOther: false,
            title: 'No accommodation before custody support needs identified',
            isUpdatable: false,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: null,
            isPreSelected: false,
          },
          {
            uuid: '33c32185-3ae1-40a5-a1fd-0872230c7343',
            supportNeedId: 8,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: false,
            category: 'Moving to new accommodation',
            isOther: false,
            title: 'Help to find accommodation',
            isUpdatable: true,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: null,
            isPreSelected: false,
          },
          {
            uuid: '531b4b31-a5ed-48cc-87ff-ac933e65b7fa',
            supportNeedId: 9,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: false,
            category: 'Moving to new accommodation',
            isOther: false,
            title:
              'Home adaptations needed for new accommodation (changes to make it safer and easier to move around and do everyday tasks)',
            isUpdatable: true,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: null,
            isPreSelected: false,
          },
          {
            uuid: '661f221e-defd-48e3-895a-2b09cf216108',
            supportNeedId: 10,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: true,
            category: 'Moving to new accommodation',
            isOther: false,
            title: 'Other',
            isUpdatable: true,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: null,
            isPreSelected: false,
          },
          {
            uuid: 'selected-no-need-identified-2',
            supportNeedId: 11,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: false,
            category: 'Moving to new accommodation',
            isOther: false,
            title: 'No new accommodation support needs identified',
            isUpdatable: false,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: null,
            isPreSelected: false,
          },
          {
            uuid: 'third-uuid-of-supportNeed-is-updatable',
            supportNeedId: 12,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: false,
            category: 'Accommodation related debt and arrears',
            isOther: false,
            title: 'Set up payment for rent arrears',
            isUpdatable: true,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: null,
            isPreSelected: false,
          },
          {
            uuid: '329dbffb-de74-4cb5-8e36-4562218ecffe',
            supportNeedId: 13,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: false,
            category: 'Accommodation related debt and arrears',
            isOther: false,
            title: 'Ensure accommodation related debt or arrears do not build up',
            isUpdatable: true,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: null,
            isPreSelected: false,
          },
          {
            uuid: '6ae72705-5a29-4f65-aa05-65ba00a9e5b1',
            supportNeedId: 14,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: true,
            category: 'Accommodation related debt and arrears',
            isOther: false,
            title: 'Other',
            isUpdatable: true,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: null,
            isPreSelected: false,
          },
          {
            uuid: 'selected-no-need-identified-3',
            supportNeedId: 15,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: false,
            category: 'Accommodation related debt and arrears',
            isOther: false,
            title: 'No accommodation related debt and arrears support needs identified',
            isUpdatable: false,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: null,
            isPreSelected: false,
          },
        ],
      })

      await request(app)
        .post('/support-needs/accommodation')
        .send({
          'Moving to new accommodation': 'selected-no-need-identified-1',
          'Accommodation before custody': 'selected-no-need-identified-2',
          'Accommodation related debt and arrears': 'selected-no-need-identified-3',
          _csrf: 'xjM2bce6',
          prisonerNumber: 'A8731DY',
        })
        .expect(302)
        .expect('Location', '/support-needs/accommodation/check-answers/?prisonerNumber=A1234DY')
    })
  })

  describe('getSupportNeedsStatus without any cached answers', () => {
    beforeEach(() => {
      jest.spyOn(supportNeedStateService, 'getSupportNeeds').mockResolvedValue({
        needs: [
          {
            uuid: 'need-uuid',
            supportNeedId: 1,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: false,
            category: 'Accommodation before custody',
            isOther: false,
            title: 'End a tenancy',
            isUpdatable: true,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: null,
            isPreSelected: false,
          },
          {
            uuid: 'second-uuid-of-supportNeed-is-updatable',
            supportNeedId: 2,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: false,
            category: 'Accommodation before custody',
            isOther: false,
            title: 'Maintain a tenancy while in prison',
            isUpdatable: true,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: null,
            isPreSelected: false,
          },
          {
            uuid: 'need-uuid-is-selected',
            supportNeedId: 3,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: false,
            category: 'Accommodation before custody',
            isOther: false,
            title: 'Mortgage support while in prison',
            isUpdatable: true,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: true,
            isPreSelected: false,
          },
          {
            uuid: '622b3deb-03ff-4cfb-8555-978f1b5b0793',
            supportNeedId: 4,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: false,
            category: 'Accommodation before custody',
            isOther: false,
            title:
              'Home adaptations to stay in current accommodation (changes to make it safer and easier to move around and do everyday tasks)',
            isUpdatable: true,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: null,
            isPreSelected: false,
          },
          {
            uuid: '8176f4fb-735c-45e6-bfc3-cf8833b08a83',
            supportNeedId: 5,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: false,
            category: 'Accommodation before custody',
            isOther: false,
            title: 'Arrange storage for personal possessions while in prison',
            isUpdatable: true,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: null,
            isPreSelected: false,
          },
          {
            uuid: 'f3dc52b8-5b5e-4bad-8411-d8291e110169',
            supportNeedId: 6,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: true,
            category: 'Accommodation before custody',
            isOther: false,
            title: 'Other',
            isUpdatable: true,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: null,
            isPreSelected: false,
          },
          {
            uuid: '20172ff2-0c21-4485-9402-5acf2cb60809',
            supportNeedId: 7,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: false,
            category: 'Accommodation before custody',
            isOther: false,
            title: 'No accommodation before custody support needs identified',
            isUpdatable: false,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: null,
            isPreSelected: false,
          },
          {
            uuid: '33c32185-3ae1-40a5-a1fd-0872230c7343',
            supportNeedId: 8,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: false,
            category: 'Moving to new accommodation',
            isOther: false,
            title: 'Help to find accommodation',
            isUpdatable: true,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: null,
            isPreSelected: false,
          },
          {
            uuid: '531b4b31-a5ed-48cc-87ff-ac933e65b7fa',
            supportNeedId: 9,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: false,
            category: 'Moving to new accommodation',
            isOther: false,
            title:
              'Home adaptations needed for new accommodation (changes to make it safer and easier to move around and do everyday tasks)',
            isUpdatable: true,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: null,
            isPreSelected: false,
          },
          {
            uuid: '661f221e-defd-48e3-895a-2b09cf216108',
            supportNeedId: 10,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: true,
            category: 'Moving to new accommodation',
            isOther: false,
            title: 'Other',
            isUpdatable: true,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: null,
            isPreSelected: false,
          },
          {
            uuid: 'uuid-of-supportNeed-not-updatable',
            supportNeedId: 11,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: false,
            category: 'Moving to new accommodation',
            isOther: false,
            title: 'No new accommodation support needs identified',
            isUpdatable: false,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: null,
            isPreSelected: false,
          },
          {
            uuid: 'third-uuid-of-supportNeed-is-updatable',
            supportNeedId: 12,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: false,
            category: 'Accommodation related debt and arrears',
            isOther: false,
            title: 'Set up payment for rent arrears',
            isUpdatable: true,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: null,
            isPreSelected: false,
          },
          {
            uuid: '329dbffb-de74-4cb5-8e36-4562218ecffe',
            supportNeedId: 13,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: false,
            category: 'Accommodation related debt and arrears',
            isOther: false,
            title: 'Ensure accommodation related debt or arrears do not build up',
            isUpdatable: true,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: null,
            isPreSelected: false,
          },
          {
            uuid: '6ae72705-5a29-4f65-aa05-65ba00a9e5b1',
            supportNeedId: 14,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: true,
            category: 'Accommodation related debt and arrears',
            isOther: false,
            title: 'Other',
            isUpdatable: true,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: null,
            isPreSelected: false,
          },
          {
            uuid: '574fc882-0528-4754-aeeb-1b4a04a44912',
            supportNeedId: 15,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: false,
            category: 'Accommodation related debt and arrears',
            isOther: false,
            title: 'No accommodation related debt and arrears support needs identified',
            isUpdatable: false,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: null,
            isPreSelected: false,
          },
        ],
      })
    })

    it('should throw an error if pathway is invalid', async () => {
      await request(app).get('/support-needs/invalid-pathway/status/need-uuid/?prisonerNumber=A1234DY').expect(500)
    })

    it('should throw an error if supportNeeds feature is off', async () => {
      stubFeatureFlagToFalse(featureFlags)
      await request(app).get('/support-needs/accommodation/status/need-uuid/?prisonerNumber=A1234DY').expect(500)
    })

    it('should throw an error if the uuid does not exist in cache', async () => {
      await request(app).get('/support-needs/accommodation/status/invalid-uuid/?prisonerNumber=A1234DY').expect(404)
    })

    it("should throw an error if the uuid exists in cache but isn't selected", async () => {
      await request(app).get('/support-needs/accommodation/status/need-uuid/?prisonerNumber=A1234DY').expect(404)
    })

    it('should render the support needs status page', async () => {
      await request(app)
        .get('/support-needs/accommodation/status/need-uuid-is-selected/?prisonerNumber=A1234DY')
        .expect(200)
        .expect(res => {
          expect(res.text).toMatchSnapshot()
        })
    })
  })

  describe('getSupportNeedsStatus with cached answers', () => {
    beforeEach(() => {
      jest.spyOn(supportNeedStateService, 'getSupportNeeds').mockResolvedValue({
        needs: [
          {
            uuid: 'need-uuid',
            supportNeedId: 1,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: false,
            category: 'Accommodation before custody',
            isOther: false,
            title: 'End a tenancy',
            isUpdatable: true,
            isPrisonResponsible: true,
            isProbationResponsible: true,
            otherSupportNeedText: null,
            status: 'IN_PROGRESS',
            updateText: 'Some text input',
            isSelected: true,
            isPreSelected: false,
          },
          {
            uuid: 'second-uuid-of-supportNeed-is-updatable',
            supportNeedId: 2,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: false,
            category: 'Accommodation before custody',
            isOther: false,
            title: 'Maintain a tenancy while in prison',
            isUpdatable: true,
            isPrisonResponsible: false,
            isProbationResponsible: true,
            otherSupportNeedText: null,
            status: 'DECLINED',
            updateText: 'Additional details text body',
            isSelected: true,
            isPreSelected: false,
          },
        ],
      })
    })

    it('should throw an error if pathway is invalid', async () => {
      await request(app).get('/support-needs/invalid-pathway/status/need-uuid/?prisonerNumber=A1234DY').expect(500)
    })

    it('should throw an error if supportNeeds feature is off', async () => {
      stubFeatureFlagToFalse(featureFlags)
      await request(app).get('/support-needs/accommodation/status/need-uuid/?prisonerNumber=A1234DY').expect(500)
    })

    it('should throw an error if the uuid does not exist in cache', async () => {
      await request(app).get('/support-needs/accommodation/status/invalid-uuid/?prisonerNumber=A1234DY').expect(404)
    })

    it('should render the support needs status page', async () => {
      await request(app)
        .get('/support-needs/accommodation/status/need-uuid/?prisonerNumber=A1234DY')
        .expect(200)
        .expect(res => {
          expect(res.text).toMatchSnapshot()
        })
    })

    it('should render the support needs status page - edit', async () => {
      await request(app)
        .get('/support-needs/accommodation/status/need-uuid/?prisonerNumber=A1234DY&edit=true')
        .expect(200)
        .expect(res => {
          expect(res.text).toMatchSnapshot()
        })
    })
  })

  describe('getSupportNeedsStatus with cached other support need answer', () => {
    beforeEach(() => {
      jest.spyOn(supportNeedStateService, 'getSupportNeeds').mockResolvedValue({
        needs: [
          {
            uuid: 'need-uuid',
            supportNeedId: 1,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: false,
            category: 'Accommodation before custody',
            isOther: true,
            title: 'Other',
            isUpdatable: true,
            isPrisonResponsible: true,
            isProbationResponsible: true,
            otherSupportNeedText: 'Custom support need title',
            status: 'IN_PROGRESS',
            updateText: 'Some text input',
            isSelected: true,
            isPreSelected: false,
          },
        ],
      })
    })

    it('should throw an error if pathway is invalid', async () => {
      await request(app).get('/support-needs/invalid-pathway/status/need-uuid/?prisonerNumber=A1234DY').expect(500)
    })

    it('should throw an error if supportNeeds feature is off', async () => {
      stubFeatureFlagToFalse(featureFlags)
      await request(app).get('/support-needs/accommodation/status/need-uuid/?prisonerNumber=A1234DY').expect(500)
    })

    it('should throw an error if the uuid does not exist in cache', async () => {
      await request(app).get('/support-needs/accommodation/status/invalid-uuid/?prisonerNumber=A1234DY').expect(404)
    })

    it('should render the support needs status page', async () => {
      await request(app)
        .get('/support-needs/accommodation/status/need-uuid/?prisonerNumber=A1234DY')
        .expect(200)
        .expect(res => {
          expect(res.text).toMatchSnapshot()
        })
    })

    it('should render the support needs status page - edit', async () => {
      await request(app)
        .get('/support-needs/accommodation/status/need-uuid/?prisonerNumber=A1234DY&edit=true')
        .expect(200)
        .expect(res => {
          expect(res.text).toMatchSnapshot()
        })
    })
  })

  describe('submitSupportNeedsStatus', () => {
    it('should throw an error if pathway is invalid', async () => {
      await request(app).get('/support-needs/invalid-pathway/status/need-uuid/?prisonerNumber=A1234DY').expect(500)
    })

    it('should throw an error if supportNeeds feature is off', async () => {
      stubFeatureFlagToFalse(featureFlags)
      await request(app).get('/support-needs/accommodation/status/need-uuid/?prisonerNumber=A1234DY').expect(500)
    })

    it('should throw an error if the uuid does not exist in cache', async () => {
      await request(app).get('/support-needs/accommodation/status/invalid-uuid/?prisonerNumber=A1234DY').expect(500)
    })

    it('should throw an error if support need index is not found in cache', async () => {
      jest.spyOn(supportNeedStateService, 'getSupportNeeds').mockResolvedValue({
        needs: [], // Empty array to ensure findIndex returns -1
      })

      await request(app)
        .post('/support-needs/accommodation/status/second-uuid-of-supportNeed-is-updatable')
        .send({
          _csrf: 'xjM2bce6',
          prisonerNumber: 'A8731DY',
          status: 'MET',
          responsibleStaff: ['PRISON'],
          updateText: '',
        })
        .expect(500)
    })

    describe('form validation', () => {
      beforeEach(() => {
        jest.spyOn(supportNeedStateService, 'getSupportNeeds').mockResolvedValue({
          needs: [
            {
              uuid: 'first-uuid',
              supportNeedId: 1,
              existingPrisonerSupportNeedId: null,
              allowUserDesc: false,
              category: 'Accommodation before custody',
              isOther: false,
              title: 'End a tenancy',
              isUpdatable: true,
              isPrisonResponsible: null,
              isProbationResponsible: null,
              otherSupportNeedText: null,
              status: null,
              updateText: null,
              isSelected: true,
              isPreSelected: false,
            },
          ],
        })
      })

      const postUrl = '/support-needs/accommodation/status/first-uuid'
      const getUrl = '/support-needs/accommodation/status/first-uuid/?prisonerNumber=A1234DY'
      const validSubmission = {
        _csrf: 'xjM2bce6',
        prisonerNumber: 'A8731DY',
        status: 'MET',
        responsibleStaff: ['PRISON', 'PROBATION'],
        updateText: 'Some text in the additional details textarea',
        otherSupportNeedText: '',
      }

      it('should not allow submission if status is missing', async () => {
        const submission = { ...validSubmission }
        delete submission.status

        await request(app).post(postUrl).send(submission).expect(302).expect('Location', getUrl)

        expect(supportNeedStateService.setSupportNeeds).not.toHaveBeenCalled()
      })

      it('should not allow submission if status is invalid', async () => {
        const submission = { ...validSubmission, status: 'X' }

        await request(app).post(postUrl).send(submission).expect(302).expect('Location', getUrl)

        expect(supportNeedStateService.setSupportNeeds).not.toHaveBeenCalled()
      })

      it('should not allow submission if responsible staff is missing', async () => {
        const submission = { ...validSubmission }
        delete submission.responsibleStaff

        await request(app).post(postUrl).send(submission).expect(302).expect('Location', getUrl)

        expect(supportNeedStateService.setSupportNeeds).not.toHaveBeenCalled()
      })

      it('should not allow submission if responsible staff is invalid', async () => {
        const submission = { ...validSubmission, responsibleStaff: ['PRISON', 'X'] }

        await request(app).post(postUrl).send(submission).expect(302).expect('Location', getUrl)

        expect(supportNeedStateService.setSupportNeeds).not.toHaveBeenCalled()
      })

      it('should allow submission if responsible staff is a valid string', async () => {
        const submission = { ...validSubmission, responsibleStaff: 'PRISON' }

        await request(app)
          .post(postUrl)
          .send(submission)
          .expect(302)
          .expect('Location', '/support-needs/accommodation/check-answers/?prisonerNumber=A1234DY')

        expect(supportNeedStateService.setSupportNeeds).toHaveBeenCalled()
      })

      it('should allow submission if both responsible staff is a valid array', async () => {
        const submission = { ...validSubmission, responsibleStaff: ['PRISON'] }

        await request(app)
          .post(postUrl)
          .send(submission)
          .expect(302)
          .expect('Location', '/support-needs/accommodation/check-answers/?prisonerNumber=A1234DY')

        expect(supportNeedStateService.setSupportNeeds).toHaveBeenCalled()
      })

      it('should allow submission if update text is missing', async () => {
        const submission = { ...validSubmission }
        delete submission.updateText

        await request(app)
          .post(postUrl)
          .send(submission)
          .expect(302)
          .expect('Location', '/support-needs/accommodation/check-answers/?prisonerNumber=A1234DY')

        expect(supportNeedStateService.setSupportNeeds).toHaveBeenCalled()
      })

      it('should not allow submission if update text is over 3000 characters', async () => {
        const submission = { ...validSubmission, updateText: 'X'.repeat(3001) }

        await request(app).post(postUrl).send(submission).expect(302).expect('Location', getUrl)

        expect(supportNeedStateService.setSupportNeeds).not.toHaveBeenCalled()
      })
    })
  })

  it('should redirect to the next support needs status page', async () => {
    const stateKey = {
      prisonerNumber: 'A1234DY',
      userId: 'user1',
      pathway: 'ACCOMMODATION',
    }

    jest.spyOn(supportNeedStateService, 'getSupportNeeds').mockResolvedValue({
      needs: [
        {
          uuid: 'first-uuid',
          supportNeedId: 1,
          existingPrisonerSupportNeedId: null,
          allowUserDesc: false,
          category: 'Accommodation before custody',
          isOther: false,
          title: 'End a tenancy',
          isUpdatable: true,
          isPrisonResponsible: null,
          isProbationResponsible: null,
          otherSupportNeedText: null,
          status: null,
          updateText: null,
          isSelected: true,
          isPreSelected: false,
        },
        {
          uuid: '8176f4fb-735c-45e6-bfc3-cf8833b08a83',
          supportNeedId: 5,
          existingPrisonerSupportNeedId: null,
          allowUserDesc: false,
          category: 'Accommodation before custody',
          isOther: false,
          title: 'Arrange storage for personal possessions while in prison',
          isUpdatable: true,
          isPrisonResponsible: null,
          isProbationResponsible: null,
          otherSupportNeedText: null,
          status: null,
          updateText: null,
          isSelected: null,
          isPreSelected: false,
        },
        {
          uuid: 'f3dc52b8-5b5e-4bad-8411-d8291e110169',
          supportNeedId: 6,
          existingPrisonerSupportNeedId: null,
          allowUserDesc: true,
          category: 'Accommodation before custody',
          isOther: false,
          title: 'Other',
          isUpdatable: true,
          isPrisonResponsible: null,
          isProbationResponsible: null,
          otherSupportNeedText: null,
          status: null,
          updateText: null,
          isSelected: null,
          isPreSelected: false,
        },
        {
          uuid: '20172ff2-0c21-4485-9402-5acf2cb60809',
          supportNeedId: 7,
          existingPrisonerSupportNeedId: null,
          allowUserDesc: false,
          category: 'Accommodation before custody',
          isOther: false,
          title: 'No accommodation before custody support needs identified',
          isUpdatable: false,
          isPrisonResponsible: null,
          isProbationResponsible: null,
          otherSupportNeedText: null,
          status: null,
          updateText: null,
          isSelected: true,
          isPreSelected: false,
        },
        {
          uuid: 'second-uuid-of-supportNeed-is-updatable',
          supportNeedId: 2,
          existingPrisonerSupportNeedId: null,
          allowUserDesc: false,
          category: 'Accommodation before custody',
          isOther: false,
          title: 'Maintain a tenancy while in prison',
          isUpdatable: true,
          isPrisonResponsible: null,
          isProbationResponsible: null,
          otherSupportNeedText: null,
          status: null,
          updateText: null,
          isSelected: true,
          isPreSelected: false,
        },
      ],
    })

    await request(app)
      .post('/support-needs/accommodation/status/first-uuid')
      .send({
        _csrf: 'xjM2bce6',
        prisonerNumber: 'A8731DY',
        status: 'MET',
        responsibleStaff: ['PRISON', 'PROBATION'],
        updateText: 'Some text in the additional details textarea',
        otherSupportNeedText: null,
      })
      .expect(302)
      .expect(
        'Location',
        '/support-needs/accommodation/status/second-uuid-of-supportNeed-is-updatable/?prisonerNumber=A1234DY',
      )

    expect(supportNeedStateService.setSupportNeeds).toHaveBeenCalledWith(stateKey, {
      needs: [
        {
          uuid: 'first-uuid',
          supportNeedId: 1,
          existingPrisonerSupportNeedId: null,
          allowUserDesc: false,
          category: 'Accommodation before custody',
          isOther: false,
          title: 'End a tenancy',
          isUpdatable: true,
          isPrisonResponsible: true,
          isProbationResponsible: true,
          otherSupportNeedText: null,
          status: 'MET',
          updateText: 'Some text in the additional details textarea',
          isSelected: true,
          isPreSelected: false,
        },
        {
          uuid: '8176f4fb-735c-45e6-bfc3-cf8833b08a83',
          supportNeedId: 5,
          existingPrisonerSupportNeedId: null,
          allowUserDesc: false,
          category: 'Accommodation before custody',
          isOther: false,
          title: 'Arrange storage for personal possessions while in prison',
          isUpdatable: true,
          isPrisonResponsible: null,
          isProbationResponsible: null,
          otherSupportNeedText: null,
          status: null,
          updateText: null,
          isSelected: null,
          isPreSelected: false,
        },
        {
          uuid: 'f3dc52b8-5b5e-4bad-8411-d8291e110169',
          supportNeedId: 6,
          existingPrisonerSupportNeedId: null,
          allowUserDesc: true,
          category: 'Accommodation before custody',
          isOther: false,
          title: 'Other',
          isUpdatable: true,
          isPrisonResponsible: null,
          isProbationResponsible: null,
          otherSupportNeedText: null,
          status: null,
          updateText: null,
          isSelected: null,
          isPreSelected: false,
        },
        {
          uuid: '20172ff2-0c21-4485-9402-5acf2cb60809',
          supportNeedId: 7,
          existingPrisonerSupportNeedId: null,
          allowUserDesc: false,
          category: 'Accommodation before custody',
          isOther: false,
          title: 'No accommodation before custody support needs identified',
          isUpdatable: false,
          isPrisonResponsible: null,
          isProbationResponsible: null,
          otherSupportNeedText: null,
          status: null,
          updateText: null,
          isSelected: true,
          isPreSelected: false,
        },
        {
          uuid: 'second-uuid-of-supportNeed-is-updatable',
          supportNeedId: 2,
          existingPrisonerSupportNeedId: null,
          allowUserDesc: false,
          category: 'Accommodation before custody',
          isOther: false,
          title: 'Maintain a tenancy while in prison',
          isUpdatable: true,
          isPrisonResponsible: null,
          isProbationResponsible: null,
          otherSupportNeedText: null,
          status: null,
          updateText: null,
          isSelected: true,
          isPreSelected: false,
        },
      ],
    })
  })

  it('should redirect to the check your answers page if no more updatable supportNeeds remaining', async () => {
    jest.spyOn(supportNeedStateService, 'getSupportNeeds').mockResolvedValue({
      needs: [
        {
          uuid: 'first-uuid-of-supportNeed-is-updatable',
          supportNeedId: 1,
          existingPrisonerSupportNeedId: null,
          allowUserDesc: false,
          category: 'Accommodation before custody',
          isOther: false,
          title: 'End a tenancy',
          isUpdatable: true,
          isPrisonResponsible: null,
          isProbationResponsible: null,
          otherSupportNeedText: null,
          status: null,
          updateText: null,
          isSelected: true,
          isPreSelected: false,
        },
        {
          uuid: '8176f4fb-735c-45e6-bfc3-cf8833b08a83',
          supportNeedId: 5,
          existingPrisonerSupportNeedId: null,
          allowUserDesc: false,
          category: 'Accommodation before custody',
          isOther: false,
          title: 'Arrange storage for personal possessions while in prison',
          isUpdatable: true,
          isPrisonResponsible: null,
          isProbationResponsible: null,
          otherSupportNeedText: null,
          status: null,
          updateText: null,
          isSelected: null,
          isPreSelected: false,
        },
        {
          uuid: 'not-selected',
          supportNeedId: 6,
          existingPrisonerSupportNeedId: null,
          allowUserDesc: true,
          category: 'Accommodation before custody',
          isOther: false,
          title: 'Other',
          isUpdatable: true,
          isPrisonResponsible: null,
          isProbationResponsible: null,
          otherSupportNeedText: null,
          status: null,
          updateText: null,
          isSelected: null,
          isPreSelected: false,
        },
        {
          uuid: 'second-uuid-of-supportNeed-is-updatable',
          supportNeedId: 2,
          existingPrisonerSupportNeedId: null,
          allowUserDesc: false,
          category: 'Accommodation before custody',
          isOther: false,
          title: 'Maintain a tenancy while in prison',
          isUpdatable: true,
          isPrisonResponsible: null,
          isProbationResponsible: null,
          otherSupportNeedText: null,
          status: null,
          updateText: null,
          isSelected: true,
          isPreSelected: false,
        },
        {
          uuid: 'selected-but-not-updatable-2',
          supportNeedId: 7,
          existingPrisonerSupportNeedId: null,
          allowUserDesc: false,
          category: 'Accommodation before custody',
          isOther: false,
          title: 'No accommodation before custody support needs identified',
          isUpdatable: false,
          isPrisonResponsible: null,
          isProbationResponsible: null,
          otherSupportNeedText: null,
          status: null,
          updateText: null,
          isSelected: true,
          isPreSelected: false,
        },
      ],
    })

    await request(app)
      .post('/support-needs/accommodation/status/second-uuid-of-supportNeed-is-updatable')
      .send({
        _csrf: 'xjM2bce6',
        prisonerNumber: 'A8731DY',
        status: 'MET',
        responsibleStaff: ['PRISON'],
        updateText: '',
      })
      .expect(302)
      .expect('Location', '/support-needs/accommodation/check-answers/?prisonerNumber=A1234DY')
  })

  it('should redirect to the check your answers page if its an edit', async () => {
    jest.spyOn(supportNeedStateService, 'getSupportNeeds').mockResolvedValue({
      needs: [
        {
          uuid: 'first-uuid-of-supportNeed-is-updatable',
          supportNeedId: 1,
          existingPrisonerSupportNeedId: null,
          allowUserDesc: false,
          category: 'Accommodation before custody',
          isOther: false,
          title: 'End a tenancy',
          isUpdatable: true,
          isPrisonResponsible: null,
          isProbationResponsible: null,
          otherSupportNeedText: null,
          status: null,
          updateText: null,
          isSelected: true,
          isPreSelected: false,
        },
        {
          uuid: '8176f4fb-735c-45e6-bfc3-cf8833b08a83',
          supportNeedId: 5,
          existingPrisonerSupportNeedId: null,
          allowUserDesc: false,
          category: 'Accommodation before custody',
          isOther: false,
          title: 'Arrange storage for personal possessions while in prison',
          isUpdatable: true,
          isPrisonResponsible: null,
          isProbationResponsible: null,
          otherSupportNeedText: null,
          status: null,
          updateText: null,
          isSelected: null,
          isPreSelected: false,
        },
        {
          uuid: 'not-selected',
          supportNeedId: 6,
          existingPrisonerSupportNeedId: null,
          allowUserDesc: true,
          category: 'Accommodation before custody',
          isOther: false,
          title: 'Other',
          isUpdatable: true,
          isPrisonResponsible: null,
          isProbationResponsible: null,
          otherSupportNeedText: null,
          status: null,
          updateText: null,
          isSelected: null,
          isPreSelected: false,
        },
        {
          uuid: 'second-uuid-of-supportNeed-is-updatable',
          supportNeedId: 2,
          existingPrisonerSupportNeedId: null,
          allowUserDesc: false,
          category: 'Accommodation before custody',
          isOther: false,
          title: 'Maintain a tenancy while in prison',
          isUpdatable: true,
          isPrisonResponsible: null,
          isProbationResponsible: null,
          otherSupportNeedText: null,
          status: null,
          updateText: null,
          isSelected: true,
          isPreSelected: false,
        },
        {
          uuid: 'selected-but-not-updatable-2',
          supportNeedId: 7,
          existingPrisonerSupportNeedId: null,
          allowUserDesc: false,
          category: 'Accommodation before custody',
          isOther: false,
          title: 'No accommodation before custody support needs identified',
          isUpdatable: false,
          isPrisonResponsible: null,
          isProbationResponsible: null,
          otherSupportNeedText: null,
          status: null,
          updateText: null,
          isSelected: true,
          isPreSelected: false,
        },
      ],
    })

    await request(app)
      .post('/support-needs/accommodation/status/first-uuid-of-supportNeed-is-updatable')
      .send({
        _csrf: 'xjM2bce6',
        prisonerNumber: 'A8731DY',
        status: 'MET',
        responsibleStaff: ['PRISON'],
        updateText: '',
        edit: 'true',
      })
      .expect(302)
      .expect('Location', '/support-needs/accommodation/check-answers/?prisonerNumber=A1234DY')
  })

  describe('getCheckAnswers', () => {
    it('should throw an error if pathway is invalid', async () => {
      await request(app).get('/support-needs/invalid-pathway/status/need-uuid/?prisonerNumber=A1234DY').expect(500)
    })

    it('should throw an error if supportNeeds feature is off', async () => {
      stubFeatureFlagToFalse(featureFlags)
      await request(app).get('/support-needs/accommodation/status/need-uuid/?prisonerNumber=A1234DY').expect(500)
    })

    it('should throw an error if the uuid does not exist in cache', async () => {
      await request(app).get('/support-needs/accommodation/status/invalid-uuid/?prisonerNumber=A1234DY').expect(500)
    })

    it('should render the check your answers page', async () => {
      jest.spyOn(supportNeedStateService, 'getSupportNeeds').mockResolvedValue({
        needs: [
          {
            uuid: '123',
            supportNeedId: 1,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: false,
            category: 'First category',
            isOther: false,
            title: 'End a tenancy',
            isUpdatable: true,
            isPrisonResponsible: true,
            isProbationResponsible: true,
            otherSupportNeedText: null,
            status: 'MET',
            updateText: 'some text from the additional details',
            isSelected: true,
            isPreSelected: false,
          },
          {
            uuid: '789',
            supportNeedId: 3,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: false,
            category: 'First category',
            isOther: false,
            title: 'Arrange storage for personal possessions while in prison',
            isUpdatable: true,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: null,
            isPreSelected: false,
          },
          {
            uuid: '112233',
            supportNeedId: 4,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: true,
            category: 'First category',
            isOther: false,
            title: 'Other',
            isUpdatable: true,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: null,
            isPreSelected: false,
          },
          {
            uuid: '445566',
            supportNeedId: 5,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: false,
            category: 'First category',
            isOther: true,
            title: 'Other',
            isUpdatable: true,
            isPrisonResponsible: true,
            isProbationResponsible: true,
            otherSupportNeedText: 'Other support need text',
            status: 'MET',
            updateText: null,
            isSelected: true,
            isPreSelected: false,
          },
          {
            uuid: '778899',
            supportNeedId: 6,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: false,
            category: 'First category',
            isOther: false,
            title: 'No support needs identified',
            isUpdatable: false,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: false,
            isPreSelected: false,
          },
          {
            uuid: '456',
            supportNeedId: 2,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: false,
            category: 'Second category',
            isOther: false,
            title: 'No support need identified',
            isUpdatable: false,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: true,
            isPreSelected: false,
          },
        ],
      })
      await request(app)
        .get('/support-needs/accommodation/check-answers/?prisonerNumber=A1234DY')
        .expect(200)
        .expect(res => {
          expect(res.text).toMatchSnapshot()
        })
    })
  })

  describe('finaliseSupportNeeds', () => {
    it('should throw an error if pathway is invalid', async () => {
      await request(app)
        .post('/support-needs/invalid-pathway/complete/?prisonerNumber=A1234DY')
        .send({
          _csrf: 'xjM2bce6',
          prisonerNumber: 'A8731DY',
        })
        .expect(500)
    })

    it('should throw an error if supportNeeds feature is off', async () => {
      stubFeatureFlagToFalse(featureFlags)
      await request(app)
        .post('/support-needs/accommodation/complete/?prisonerNumber=A1234DY')
        .send({
          _csrf: 'xjM2bce6',
          prisonerNumber: 'A8731DY',
        })
        .expect(500)
    })

    it('should submit supportNeeds and redirect to pathway page', async () => {
      jest.spyOn(supportNeedStateService, 'getSupportNeeds').mockResolvedValue({
        needs: [
          {
            uuid: 'first-uuid-of-supportNeed-is-updatable',
            supportNeedId: 1,
            existingPrisonerSupportNeedId: 22,
            allowUserDesc: false,
            category: 'Accommodation before custody',
            isOther: false,
            title: 'End a tenancy',
            isUpdatable: true,
            isPrisonResponsible: true,
            isProbationResponsible: true,
            otherSupportNeedText: null,
            status: 'MET',
            updateText: 'some text from the additional details',
            isSelected: true,
            isPreSelected: false,
          },
          {
            uuid: '8176f4fb-735c-45e6-bfc3-cf8833b08a83',
            supportNeedId: 5,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: false,
            category: 'Accommodation before custody',
            isOther: false,
            title: 'Arrange storage for personal possessions while in prison',
            isUpdatable: true,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: null,
            isPreSelected: false,
          },
          {
            uuid: 'not-selected',
            supportNeedId: 6,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: true,
            category: 'Accommodation before custody',
            isOther: false,
            title: 'Other',
            isUpdatable: true,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: null,
            isPreSelected: false,
          },
          {
            uuid: 'second-uuid-of-supportNeed-is-updatable',
            supportNeedId: 2,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: false,
            category: 'Accommodation before custody',
            isOther: false,
            title: 'Maintain a tenancy while in prison',
            isUpdatable: true,
            isPrisonResponsible: false,
            isProbationResponsible: true,
            otherSupportNeedText: null,
            status: 'IN_PROGRESS',
            updateText: 'Another textarea',
            isSelected: true,
            isPreSelected: false,
          },
          {
            uuid: 'selected-but-not-updatable-2',
            supportNeedId: 7,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: false,
            category: 'Accommodation before custody',
            isOther: false,
            title: 'No accommodation before custody support needs identified',
            isUpdatable: false,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: false,
            isPreSelected: false,
          },
        ],
      })

      await request(app)
        .post('/support-needs/accommodation/complete/?prisonerNumber=A1234DY')
        .send({
          _csrf: 'xjM2bce6',
          prisonerNumber: 'A8731DY',
        })
        .expect(302)
        .expect('Location', '/accommodation/?prisonerNumber=A1234DY#support-needs')

      expect(rpService.postSupportNeeds).toHaveBeenCalledWith('A1234DY', {
        needs: [
          {
            needId: 1,
            prisonerSupportNeedId: 22,
            isPrisonResponsible: true,
            isProbationResponsible: true,
            otherDesc: null,
            status: 'MET',
            text: 'some text from the additional details',
          },
          {
            needId: 2,
            prisonerSupportNeedId: null,
            isPrisonResponsible: false,
            isProbationResponsible: true,
            otherDesc: null,
            status: 'IN_PROGRESS',
            text: 'Another textarea',
          },
        ],
      })
    })
  })

  describe('deleteSupportNeed', () => {
    it('should delete support need and redirect to next - not an edit', async () => {
      const getSupportNeedsSpy = jest.spyOn(supportNeedStateService, 'getSupportNeeds').mockResolvedValue({
        needs: [
          {
            uuid: 'e348e24d-3318-4f87-8ae4-e3b6bb345725',
            supportNeedId: 1,
            existingPrisonerSupportNeedId: 22,
            allowUserDesc: false,
            category: 'Accommodation before custody',
            isOther: false,
            title: 'End a tenancy',
            isUpdatable: true,
            isPrisonResponsible: true,
            isProbationResponsible: true,
            otherSupportNeedText: null,
            status: 'MET',
            updateText: 'some text from the additional details',
            isSelected: true,
            isPreSelected: false,
          },
          {
            uuid: 'c0b3c819-ba84-41ac-85d2-cc9467db9c06',
            supportNeedId: 2,
            existingPrisonerSupportNeedId: 23,
            allowUserDesc: false,
            category: 'Accommodation before custody',
            isOther: false,
            title: 'Maintain a tenancy while in prison',
            isUpdatable: true,
            isPrisonResponsible: false,
            isProbationResponsible: true,
            otherSupportNeedText: null,
            status: 'IN_PROGRESS',
            updateText: 'some other text from the additional details',
            isSelected: true,
            isPreSelected: false,
          },
          {
            uuid: 'c0b3c819-ba84-41ac-85d2-cc9467db9c06',
            supportNeedId: 8,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: false,
            category: 'Moving to new accommodation',
            isOther: false,
            title: 'Help to find accommodation',
            isUpdatable: true,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: false,
            isPreSelected: false,
          },
        ],
      })

      const setSupportNeedsSpy = jest.spyOn(supportNeedStateService, 'setSupportNeeds').mockImplementation()

      await request(app)
        .post('/support-needs/accommodation/status/e348e24d-3318-4f87-8ae4-e3b6bb345725/delete')
        .send({
          _csrf: 'xjM2bce6',
          prisonerNumber: 'A8731DY',
          edit: 'false',
        })
        .expect(302)
        .expect(
          'Location',
          '/support-needs/accommodation/status/c0b3c819-ba84-41ac-85d2-cc9467db9c06/?prisonerNumber=A1234DY',
        )

      expect(getSupportNeedsSpy).toHaveBeenCalledWith({
        pathway: 'ACCOMMODATION',
        prisonerNumber: 'A1234DY',
        userId: 'user1',
      })

      expect(setSupportNeedsSpy).toHaveBeenCalledWith(
        {
          pathway: 'ACCOMMODATION',
          prisonerNumber: 'A1234DY',
          userId: 'user1',
        },
        {
          needs: [
            {
              uuid: 'e348e24d-3318-4f87-8ae4-e3b6bb345725',
              supportNeedId: 1,
              existingPrisonerSupportNeedId: 22,
              allowUserDesc: false,
              category: 'Accommodation before custody',
              isOther: false,
              title: 'End a tenancy',
              isUpdatable: true,
              isPrisonResponsible: null,
              isProbationResponsible: null,
              otherSupportNeedText: null,
              status: null,
              updateText: null,
              isSelected: false,
              isPreSelected: false,
            },
            {
              uuid: 'c0b3c819-ba84-41ac-85d2-cc9467db9c06',
              supportNeedId: 2,
              existingPrisonerSupportNeedId: 23,
              allowUserDesc: false,
              category: 'Accommodation before custody',
              isOther: false,
              title: 'Maintain a tenancy while in prison',
              isUpdatable: true,
              isPrisonResponsible: false,
              isProbationResponsible: true,
              otherSupportNeedText: null,
              status: 'IN_PROGRESS',
              updateText: 'some other text from the additional details',
              isSelected: true,
              isPreSelected: false,
            },
            {
              uuid: 'c0b3c819-ba84-41ac-85d2-cc9467db9c06',
              supportNeedId: 8,
              existingPrisonerSupportNeedId: null,
              allowUserDesc: false,
              category: 'Moving to new accommodation',
              isOther: false,
              title: 'Help to find accommodation',
              isUpdatable: true,
              isPrisonResponsible: null,
              isProbationResponsible: null,
              otherSupportNeedText: null,
              status: null,
              updateText: null,
              isSelected: false,
              isPreSelected: false,
            },
          ],
        },
      )
    })

    it('should delete support need and redirect to check answers - edit', async () => {
      const getSupportNeedsSpy = jest.spyOn(supportNeedStateService, 'getSupportNeeds').mockResolvedValue({
        needs: [
          {
            uuid: 'e348e24d-3318-4f87-8ae4-e3b6bb345725',
            supportNeedId: 1,
            existingPrisonerSupportNeedId: 22,
            allowUserDesc: false,
            category: 'Accommodation before custody',
            isOther: false,
            title: 'End a tenancy',
            isUpdatable: true,
            isPrisonResponsible: true,
            isProbationResponsible: true,
            otherSupportNeedText: null,
            status: 'MET',
            updateText: 'some text from the additional details',
            isSelected: true,
            isPreSelected: false,
          },
          {
            uuid: 'c0b3c819-ba84-41ac-85d2-cc9467db9c06',
            supportNeedId: 2,
            existingPrisonerSupportNeedId: 23,
            allowUserDesc: false,
            category: 'Accommodation before custody',
            isOther: false,
            title: 'Maintain a tenancy while in prison',
            isUpdatable: true,
            isPrisonResponsible: false,
            isProbationResponsible: true,
            otherSupportNeedText: null,
            status: 'IN_PROGRESS',
            updateText: 'some other text from the additional details',
            isSelected: true,
            isPreSelected: false,
          },
          {
            uuid: 'c0b3c819-ba84-41ac-85d2-cc9467db9c06',
            supportNeedId: 8,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: false,
            category: 'Moving to new accommodation',
            isOther: false,
            title: 'Help to find accommodation',
            isUpdatable: true,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: false,
            isPreSelected: false,
          },
        ],
      })

      const setSupportNeedsSpy = jest.spyOn(supportNeedStateService, 'setSupportNeeds').mockImplementation()

      await request(app)
        .post('/support-needs/accommodation/status/e348e24d-3318-4f87-8ae4-e3b6bb345725/delete')
        .send({
          _csrf: 'xjM2bce6',
          prisonerNumber: 'A8731DY',
          edit: 'true',
        })
        .expect(302)
        .expect('Location', '/support-needs/accommodation/check-answers?prisonerNumber=A1234DY')

      expect(getSupportNeedsSpy).toHaveBeenCalledWith({
        pathway: 'ACCOMMODATION',
        prisonerNumber: 'A1234DY',
        userId: 'user1',
      })

      expect(setSupportNeedsSpy).toHaveBeenCalledWith(
        {
          pathway: 'ACCOMMODATION',
          prisonerNumber: 'A1234DY',
          userId: 'user1',
        },
        {
          needs: [
            {
              uuid: 'e348e24d-3318-4f87-8ae4-e3b6bb345725',
              supportNeedId: 1,
              existingPrisonerSupportNeedId: 22,
              allowUserDesc: false,
              category: 'Accommodation before custody',
              isOther: false,
              title: 'End a tenancy',
              isUpdatable: true,
              isPrisonResponsible: null,
              isProbationResponsible: null,
              otherSupportNeedText: null,
              status: null,
              updateText: null,
              isSelected: false,
              isPreSelected: false,
            },
            {
              uuid: 'c0b3c819-ba84-41ac-85d2-cc9467db9c06',
              supportNeedId: 2,
              existingPrisonerSupportNeedId: 23,
              allowUserDesc: false,
              category: 'Accommodation before custody',
              isOther: false,
              title: 'Maintain a tenancy while in prison',
              isUpdatable: true,
              isPrisonResponsible: false,
              isProbationResponsible: true,
              otherSupportNeedText: null,
              status: 'IN_PROGRESS',
              updateText: 'some other text from the additional details',
              isSelected: true,
              isPreSelected: false,
            },
            {
              uuid: 'c0b3c819-ba84-41ac-85d2-cc9467db9c06',
              supportNeedId: 8,
              existingPrisonerSupportNeedId: null,
              allowUserDesc: false,
              category: 'Moving to new accommodation',
              isOther: false,
              title: 'Help to find accommodation',
              isUpdatable: true,
              isPrisonResponsible: null,
              isProbationResponsible: null,
              otherSupportNeedText: null,
              status: null,
              updateText: null,
              isSelected: false,
              isPreSelected: false,
            },
          ],
        },
      )
    })

    it('should delete support need and redirect to check answers - no more selected support needs', async () => {
      const getSupportNeedsSpy = jest.spyOn(supportNeedStateService, 'getSupportNeeds').mockResolvedValue({
        needs: [
          {
            uuid: 'e348e24d-3318-4f87-8ae4-e3b6bb345725',
            supportNeedId: 1,
            existingPrisonerSupportNeedId: 22,
            allowUserDesc: false,
            category: 'Accommodation before custody',
            isOther: false,
            title: 'End a tenancy',
            isUpdatable: true,
            isPrisonResponsible: true,
            isProbationResponsible: true,
            otherSupportNeedText: null,
            status: 'MET',
            updateText: 'some text from the additional details',
            isSelected: true,
            isPreSelected: false,
          },
          {
            uuid: 'c0b3c819-ba84-41ac-85d2-cc9467db9c06',
            supportNeedId: 2,
            existingPrisonerSupportNeedId: 23,
            allowUserDesc: false,
            category: 'Accommodation before custody',
            isOther: false,
            title: 'Maintain a tenancy while in prison',
            isUpdatable: true,
            isPrisonResponsible: false,
            isProbationResponsible: true,
            otherSupportNeedText: null,
            status: 'IN_PROGRESS',
            updateText: 'some other text from the additional details',
            isSelected: true,
            isPreSelected: false,
          },
          {
            uuid: 'c0b3c819-ba84-41ac-85d2-cc9467db9c06',
            supportNeedId: 8,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: false,
            category: 'Moving to new accommodation',
            isOther: false,
            title: 'Help to find accommodation',
            isUpdatable: true,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: false,
            isPreSelected: false,
          },
        ],
      })

      const setSupportNeedsSpy = jest.spyOn(supportNeedStateService, 'setSupportNeeds').mockImplementation()

      await request(app)
        .post('/support-needs/accommodation/status/c0b3c819-ba84-41ac-85d2-cc9467db9c06/delete')
        .send({
          _csrf: 'xjM2bce6',
          prisonerNumber: 'A8731DY',
          edit: 'false',
        })
        .expect(302)
        .expect('Location', '/support-needs/accommodation/check-answers?prisonerNumber=A1234DY')

      expect(getSupportNeedsSpy).toHaveBeenCalledWith({
        pathway: 'ACCOMMODATION',
        prisonerNumber: 'A1234DY',
        userId: 'user1',
      })

      expect(setSupportNeedsSpy).toHaveBeenCalledWith(
        {
          pathway: 'ACCOMMODATION',
          prisonerNumber: 'A1234DY',
          userId: 'user1',
        },
        {
          needs: [
            {
              uuid: 'e348e24d-3318-4f87-8ae4-e3b6bb345725',
              supportNeedId: 1,
              existingPrisonerSupportNeedId: 22,
              allowUserDesc: false,
              category: 'Accommodation before custody',
              isOther: false,
              title: 'End a tenancy',
              isUpdatable: true,
              isPrisonResponsible: true,
              isProbationResponsible: true,
              otherSupportNeedText: null,
              status: 'MET',
              updateText: 'some text from the additional details',
              isSelected: true,
              isPreSelected: false,
            },
            {
              uuid: 'c0b3c819-ba84-41ac-85d2-cc9467db9c06',
              supportNeedId: 2,
              existingPrisonerSupportNeedId: 23,
              allowUserDesc: false,
              category: 'Accommodation before custody',
              isOther: false,
              title: 'Maintain a tenancy while in prison',
              isUpdatable: true,
              isPrisonResponsible: null,
              isProbationResponsible: null,
              otherSupportNeedText: null,
              status: null,
              updateText: null,
              isSelected: false,
              isPreSelected: false,
            },
            {
              uuid: 'c0b3c819-ba84-41ac-85d2-cc9467db9c06',
              supportNeedId: 8,
              existingPrisonerSupportNeedId: null,
              allowUserDesc: false,
              category: 'Moving to new accommodation',
              isOther: false,
              title: 'Help to find accommodation',
              isUpdatable: true,
              isPrisonResponsible: null,
              isProbationResponsible: null,
              otherSupportNeedText: null,
              status: null,
              updateText: null,
              isSelected: false,
              isPreSelected: false,
            },
          ],
        },
      )
    })

    it('should delete support need and redirect to check answers - no more selected support needs - with auto-selection of "No more support needs required"', async () => {
      const getSupportNeedsSpy = jest.spyOn(supportNeedStateService, 'getSupportNeeds').mockResolvedValue({
        needs: [
          {
            uuid: 'e348e24d-3318-4f87-8ae4-e3b6bb345725',
            supportNeedId: 1,
            existingPrisonerSupportNeedId: 22,
            allowUserDesc: false,
            category: 'Accommodation before custody',
            isOther: false,
            title: 'End a tenancy',
            isUpdatable: true,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: false,
            isPreSelected: false,
          },
          {
            uuid: 'c0b3c819-ba84-41ac-85d2-cc9467db9c06',
            supportNeedId: 2,
            existingPrisonerSupportNeedId: 23,
            allowUserDesc: false,
            category: 'Accommodation before custody',
            isOther: false,
            title: 'Maintain a tenancy while in prison',
            isUpdatable: true,
            isPrisonResponsible: false,
            isProbationResponsible: true,
            otherSupportNeedText: null,
            status: 'IN_PROGRESS',
            updateText: 'some other text from the additional details',
            isSelected: true,
            isPreSelected: false,
          },
          {
            uuid: '216a9eef-0fa9-4ef2-914b-dfd2a4f61e1a',
            supportNeedId: 7,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: false,
            category: 'Accommodation before custody',
            isOther: false,
            title: 'No accommodation before custody support needs identified',
            isUpdatable: false,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: false,
            isPreSelected: false,
          },
          {
            uuid: 'c0b3c819-ba84-41ac-85d2-cc9467db9c06',
            supportNeedId: 8,
            existingPrisonerSupportNeedId: null,
            allowUserDesc: false,
            category: 'Moving to new accommodation',
            isOther: false,
            title: 'Help to find accommodation',
            isUpdatable: true,
            isPrisonResponsible: null,
            isProbationResponsible: null,
            otherSupportNeedText: null,
            status: null,
            updateText: null,
            isSelected: false,
            isPreSelected: false,
          },
        ],
      })

      const setSupportNeedsSpy = jest.spyOn(supportNeedStateService, 'setSupportNeeds').mockImplementation()

      await request(app)
        .post('/support-needs/accommodation/status/c0b3c819-ba84-41ac-85d2-cc9467db9c06/delete')
        .send({
          _csrf: 'xjM2bce6',
          prisonerNumber: 'A8731DY',
          edit: 'false',
        })
        .expect(302)
        .expect('Location', '/support-needs/accommodation/check-answers?prisonerNumber=A1234DY')

      expect(getSupportNeedsSpy).toHaveBeenCalledWith({
        pathway: 'ACCOMMODATION',
        prisonerNumber: 'A1234DY',
        userId: 'user1',
      })

      expect(setSupportNeedsSpy).toHaveBeenCalledWith(
        {
          pathway: 'ACCOMMODATION',
          prisonerNumber: 'A1234DY',
          userId: 'user1',
        },
        {
          needs: [
            {
              uuid: 'e348e24d-3318-4f87-8ae4-e3b6bb345725',
              supportNeedId: 1,
              existingPrisonerSupportNeedId: 22,
              allowUserDesc: false,
              category: 'Accommodation before custody',
              isOther: false,
              title: 'End a tenancy',
              isUpdatable: true,
              isPrisonResponsible: null,
              isProbationResponsible: null,
              otherSupportNeedText: null,
              status: null,
              updateText: null,
              isSelected: false,
              isPreSelected: false,
            },
            {
              uuid: 'c0b3c819-ba84-41ac-85d2-cc9467db9c06',
              supportNeedId: 2,
              existingPrisonerSupportNeedId: 23,
              allowUserDesc: false,
              category: 'Accommodation before custody',
              isOther: false,
              title: 'Maintain a tenancy while in prison',
              isUpdatable: true,
              isPrisonResponsible: null,
              isProbationResponsible: null,
              otherSupportNeedText: null,
              status: null,
              updateText: null,
              isSelected: false,
              isPreSelected: false,
            },
            {
              uuid: '216a9eef-0fa9-4ef2-914b-dfd2a4f61e1a',
              supportNeedId: 7,
              existingPrisonerSupportNeedId: null,
              allowUserDesc: false,
              category: 'Accommodation before custody',
              isOther: false,
              title: 'No accommodation before custody support needs identified',
              isUpdatable: false,
              isPrisonResponsible: null,
              isProbationResponsible: null,
              otherSupportNeedText: null,
              status: null,
              updateText: null,
              isSelected: true,
              isPreSelected: false,
            },
            {
              uuid: 'c0b3c819-ba84-41ac-85d2-cc9467db9c06',
              supportNeedId: 8,
              existingPrisonerSupportNeedId: null,
              allowUserDesc: false,
              category: 'Moving to new accommodation',
              isOther: false,
              title: 'Help to find accommodation',
              isUpdatable: true,
              isPrisonResponsible: null,
              isProbationResponsible: null,
              otherSupportNeedText: null,
              status: null,
              updateText: null,
              isSelected: false,
              isPreSelected: false,
            },
          ],
        },
      )
    })
  })
})

import { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes, mockedServices } from '../testutils/appSetup'
import { Services } from '../../services'
import FeatureFlags from '../../featureFlag'
import {
  stubFeatureFlagToFalse,
  stubFeatureFlagToTrue,
  stubPathwaySupportNeeds,
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

  app = appWithAllRoutes({})

  FeatureFlags.getInstance = jest.fn().mockReturnValue(featureFlags)
  stubFeatureFlagToTrue(featureFlags, ['supportNeeds'])

  stubPrisonerDetails(rpService)
  stubPathwaySupportNeeds(rpService)
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('SupportNeedsController', () => {
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

    it('should render the support needs page', async () => {
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
      await request(app).get('/support-needs/accommodation/status/invalid-uuid/?prisonerNumber=A1234DY').expect(500)
    })

    it('should render the support needs status page', async () => {
      await request(app)
        .get('/support-needs/accommodation/status/need-uuid/?prisonerNumber=A1234DY')
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
      await request(app).get('/support-needs/accommodation/status/invalid-uuid/?prisonerNumber=A1234DY').expect(500)
    })

    it('should render the support needs status page', async () => {
      await request(app)
        .get('/support-needs/accommodation/status/need-uuid/?prisonerNumber=A1234DY')
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
            uuid: 'first-uuid-of-supportNeed-is-updatable',
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
            updateText: 'some text from the additional details',
            isSelected: true,
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
    it('should redirect to pathway page', async () => {
      await request(app)
        .post('/support-needs/accommodation/complete/?prisonerNumber=A1234DY')
        .send({})
        .expect(302)
        .expect('Location', '/accommodation/?prisonerNumber=A1234DY')
    })
  })
})

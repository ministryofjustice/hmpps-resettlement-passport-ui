import { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes, mockedServices } from '../testutils/appSetup'
import { Services } from '../../services'
import FeatureFlags from '../../featureFlag'
import { stubFeatureFlagToFalse, stubFeatureFlagToTrue, stubPrisonerDetails } from '../testutils/testUtils'
import { configHelper } from '../configHelperTest'
import Config from '../../s3Config'

let app: Express
const featureFlags: jest.Mocked<FeatureFlags> = new FeatureFlags() as jest.Mocked<FeatureFlags>
const config: jest.Mocked<Config> = new Config() as jest.Mocked<Config>
const { rpService } = mockedServices as Services

beforeEach(() => {
  configHelper(config)

  app = appWithAllRoutes({})

  FeatureFlags.getInstance = jest.fn().mockReturnValue(featureFlags)
  stubFeatureFlagToFalse(featureFlags)
  stubFeatureFlagToTrue(featureFlags, ['supportNeeds'])

  stubPrisonerDetails(rpService)
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('SupportNeedUpdateController', () => {
  describe('getSupportNeedUpdateForm', () => {
    it('happy path', async () => {
      const prisonerNumber = 'A1234DY'
      const prisonerNeedId = '23'

      const getPrisonerNeedByIdSpy = jest.spyOn(rpService, 'getPrisonerNeedById').mockResolvedValue({
        title: 'Support need title',
        isPrisonResponsible: true,
        isProbationResponsible: false,
        status: 'MET',
        previousUpdates: [
          {
            id: 134,
            title: 'Support need title',
            status: 'MET',
            isPrisonResponsible: true,
            isProbationResponsible: false,
            text: 'This is some update text 3',
            createdBy: 'A user',
            createdAt: '2024-12-12T12:00:00',
          },
          {
            id: 133,
            title: 'Support need title',
            status: 'IN_PROGRESS',
            isPrisonResponsible: false,
            isProbationResponsible: true,
            text: 'This is some update text 2',
            createdBy: 'B user',
            createdAt: '2024-12-11T12:00:00',
          },
          {
            id: 132,
            title: 'Support need title',
            status: 'NOT_STARTED',
            isPrisonResponsible: true,
            isProbationResponsible: true,
            text: 'This is some update text 1',
            createdBy: 'A user',
            createdAt: '2024-12-11T12:00:00',
          },
        ],
      })

      await request(app)
        .get(`/support-needs/accommodation/update/${prisonerNeedId}?prisonerNumber=${prisonerNumber}`)
        .expect(200)
        .expect(res => {
          expect(res.text).toMatchSnapshot()
        })

      expect(getPrisonerNeedByIdSpy).toHaveBeenCalledWith(prisonerNumber, prisonerNeedId)
    })

    it('should not display form when readOnlyMode = true', async () => {
      stubFeatureFlagToTrue(featureFlags, ['supportNeeds', 'readOnlyMode'])
      const prisonerNumber = 'A1234DY'
      const prisonerNeedId = '23'

      const getPrisonerNeedByIdSpy = jest.spyOn(rpService, 'getPrisonerNeedById').mockResolvedValue({
        title: 'Support need title',
        isPrisonResponsible: true,
        isProbationResponsible: false,
        status: 'MET',
        previousUpdates: [
          {
            id: 134,
            title: 'Support need title',
            status: 'MET',
            isPrisonResponsible: true,
            isProbationResponsible: false,
            text: 'This is some update text 3',
            createdBy: 'A user',
            createdAt: '2024-12-12T12:00:00',
          },
          {
            id: 133,
            title: 'Support need title',
            status: 'IN_PROGRESS',
            isPrisonResponsible: false,
            isProbationResponsible: true,
            text: 'This is some update text 2',
            createdBy: 'B user',
            createdAt: '2024-12-11T12:00:00',
          },
          {
            id: 132,
            title: 'Support need title',
            status: 'NOT_STARTED',
            isPrisonResponsible: true,
            isProbationResponsible: true,
            text: 'This is some update text 1',
            createdBy: 'A user',
            createdAt: '2024-12-11T12:00:00',
          },
        ],
      })

      await request(app)
        .get(`/support-needs/accommodation/update/${prisonerNeedId}?prisonerNumber=${prisonerNumber}`)
        .expect(200)
        .expect(res => {
          expect(res.text).toMatchSnapshot()
        })

      expect(getPrisonerNeedByIdSpy).toHaveBeenCalledWith(prisonerNumber, prisonerNeedId)
    })

    it('error case - api error', async () => {
      const prisonerNumber = 'A1234DY'
      const prisonerNeedId = '23'

      const getPrisonerNeedByIdSpy = jest.spyOn(rpService, 'getPrisonerNeedById').mockRejectedValue('Error')

      await request(app)
        .get(`/support-needs/accommodation/update/${prisonerNeedId}?prisonerNumber=${prisonerNumber}`)
        .expect(500)

      expect(getPrisonerNeedByIdSpy).toHaveBeenCalledWith(prisonerNumber, prisonerNeedId)
    })

    it("error case - pathway doesn't exist", async () => {
      const prisonerNumber = 'A1234DY'
      const prisonerNeedId = '23'

      await request(app)
        .get(`/support-needs/not-a-pathway/update/${prisonerNeedId}?prisonerNumber=${prisonerNumber}`)
        .expect(500)
    })

    it('error case - prisonerNeedId not an integer', async () => {
      const prisonerNumber = 'A1234DY'
      const prisonerNeedId = 'abc'

      await request(app)
        .get(`/support-needs/accommodation/update/${prisonerNeedId}?prisonerNumber=${prisonerNumber}`)
        .expect(500)
    })
  })

  describe('postSupportNeedUpdateForm', () => {
    it('happy path', async () => {
      const prisonerNumber = 'A1234DY'
      const prisonerNeedId = '23'

      const patchSupportNeedByIdSpy = jest.spyOn(rpService, 'patchSupportNeedById').mockImplementation()

      await request(app)
        .post(`/support-needs/accommodation/update/${prisonerNeedId}`)
        .send({
          prisonerNumber,
          additionalDetails: 'This is a comment',
          updateStatus: 'DECLINED',
          responsibleStaff: ['PRISON', 'PROBATION'],
        })
        .expect(302)
        .expect('Location', '/accommodation?prisonerNumber=A1234DY#support-needs-updates')

      expect(patchSupportNeedByIdSpy).toHaveBeenCalledWith(prisonerNumber, prisonerNeedId, {
        isPrisonResponsible: true,
        isProbationResponsible: true,
        status: 'DECLINED',
        text: 'This is a comment',
      })
    })

    it('should return 404 when readOnlyMode = true', async () => {
      stubFeatureFlagToTrue(featureFlags, ['supportNeeds', 'readOnlyMode'])
      const prisonerNumber = 'A1234DY'
      const prisonerNeedId = '23'

      jest.spyOn(rpService, 'patchSupportNeedById').mockImplementation()

      await request(app)
        .post(`/support-needs/accommodation/update/${prisonerNeedId}`)
        .send({
          prisonerNumber,
          additionalDetails: 'This is a comment',
          updateStatus: 'DECLINED',
          responsibleStaff: ['PRISON', 'PROBATION'],
        })
        .expect(404)
    })

    it('error case - api error', async () => {
      const prisonerNumber = 'A1234DY'
      const prisonerNeedId = '23'

      const patchSupportNeedByIdSpy = jest.spyOn(rpService, 'patchSupportNeedById').mockRejectedValue('Error')

      await request(app)
        .post(`/support-needs/accommodation/update/${prisonerNeedId}`)
        .send({
          prisonerNumber,
          additionalDetails: 'This is a comment',
          updateStatus: 'DECLINED',
          responsibleStaff: ['PRISON', 'PROBATION'],
        })
        .expect(500)

      expect(patchSupportNeedByIdSpy).toHaveBeenCalledWith(prisonerNumber, prisonerNeedId, {
        isPrisonResponsible: true,
        isProbationResponsible: true,
        status: 'DECLINED',
        text: 'This is a comment',
      })
    })

    it("error case - pathway doesn't exist", async () => {
      const prisonerNumber = 'A1234DY'
      const prisonerNeedId = '23'

      await request(app)
        .post(`/support-needs/not-a-pathway/update/${prisonerNeedId}`)
        .send({
          prisonerNumber,
        })
        .expect(500)
    })

    it('error case - prisonerNeedId not an integer', async () => {
      const prisonerNumber = 'A1234DY'
      const prisonerNeedId = 'abc'

      await request(app)
        .post(`/support-needs/accommodation/update/${prisonerNeedId}`)
        .send({
          prisonerNumber,
        })
        .expect(500)
    })

    it('error case - additional details has too many characters', async () => {
      const prisonerNumber = 'A1234DY'
      const prisonerNeedId = '23'

      await request(app)
        .post(`/support-needs/accommodation/update/${prisonerNeedId}`)
        .send({
          prisonerNumber,
          additionalDetails: 'x'.repeat(3001),
          updateStatus: 'DECLINED',
          responsibleStaff: ['PRISON', 'PROBATION'],
        })
        .expect(302)
        .expect('Location', `/support-needs/accommodation/update/${prisonerNeedId}?prisonerNumber=${prisonerNumber}`)
    })

    it('error case - status missing', async () => {
      const prisonerNumber = 'A1234DY'
      const prisonerNeedId = '23'

      await request(app)
        .post(`/support-needs/accommodation/update/${prisonerNeedId}`)
        .send({
          prisonerNumber,
          additionalDetails: 'x'.repeat(3000),
          responsibleStaff: ['PRISON', 'PROBATION'],
        })
        .expect(302)
        .expect('Location', `/support-needs/accommodation/update/${prisonerNeedId}?prisonerNumber=${prisonerNumber}`)
    })

    it('error case - status invalid', async () => {
      const prisonerNumber = 'A1234DY'
      const prisonerNeedId = '23'

      await request(app)
        .post(`/support-needs/accommodation/update/${prisonerNeedId}`)
        .send({
          prisonerNumber,
          updateStatus: 'X',
          additionalDetails: 'x'.repeat(3000),
          responsibleStaff: ['PRISON', 'PROBATION'],
        })
        .expect(302)
        .expect('Location', `/support-needs/accommodation/update/${prisonerNeedId}?prisonerNumber=${prisonerNumber}`)
    })

    it('error case - responsibleStaff empty array', async () => {
      const prisonerNumber = 'A1234DY'
      const prisonerNeedId = '23'

      await request(app)
        .post(`/support-needs/accommodation/update/${prisonerNeedId}`)
        .send({
          prisonerNumber,
          updateStatus: 'DECLINED',
          responsibleStaff: [],
        })
        .expect(302)
        .expect('Location', `/support-needs/accommodation/update/${prisonerNeedId}?prisonerNumber=${prisonerNumber}`)
    })

    it('error case - responsibleStaff empty string', async () => {
      const prisonerNumber = 'A1234DY'
      const prisonerNeedId = '23'

      await request(app)
        .post(`/support-needs/accommodation/update/${prisonerNeedId}`)
        .send({
          prisonerNumber,
          updateStatus: 'DECLINED',
          responsibleStaff: '',
        })
        .expect(302)
        .expect('Location', `/support-needs/accommodation/update/${prisonerNeedId}?prisonerNumber=${prisonerNumber}`)
    })

    it('error case - responsibleStaff missing', async () => {
      const prisonerNumber = 'A1234DY'
      const prisonerNeedId = '23'

      await request(app)
        .post(`/support-needs/accommodation/update/${prisonerNeedId}`)
        .send({
          prisonerNumber,
          updateStatus: 'DECLINED',
        })
        .expect(302)
        .expect('Location', `/support-needs/accommodation/update/${prisonerNeedId}?prisonerNumber=${prisonerNumber}`)
    })

    it('error case - responsibleStaff invalid', async () => {
      const prisonerNumber = 'A1234DY'
      const prisonerNeedId = '23'

      await request(app)
        .post(`/support-needs/accommodation/update/${prisonerNeedId}`)
        .send({
          prisonerNumber,
          updateStatus: 'DECLINED',
          responsibleStaff: ['X'],
        })
        .expect(302)
        .expect('Location', `/support-needs/accommodation/update/${prisonerNeedId}?prisonerNumber=${prisonerNumber}`)
    })
  })
})

import SupportNeedStore, { StateKey } from './supportNeedStore'
import { createRedisClient } from './redisClient'
import { SupportNeedsCache } from './model/supportNeeds'
import { SupportNeedStateService } from './supportNeedStateService'

jest.mock('./supportNeedStore')

const prisonerNumber = 'A1234DY'
const userId = 'user123'
const testPathway = 'TEST_PATHWAY'

describe('SupportNeedStateService', () => {
  let store: jest.Mocked<SupportNeedStore>
  let supportNeedStateService: SupportNeedStateService
  let setSupportNeedsSpy: jest.SpyInstance
  let getSupportNeedsSpy: jest.SpyInstance

  beforeEach(() => {
    store = new SupportNeedStore(createRedisClient()) as jest.Mocked<SupportNeedStore>
    supportNeedStateService = new SupportNeedStateService(store as SupportNeedStore)
    setSupportNeedsSpy = jest.spyOn(store, 'setSupportNeeds')
    getSupportNeedsSpy = jest.spyOn(store, 'getSupportNeeds')
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  function aStateKey(pathway: string): StateKey {
    return {
      prisonerNumber,
      userId,
      pathway,
    }
  }

  describe('setSupportNeeds', () => {
    it('should save support needs to the store', async () => {
      const key = aStateKey(testPathway)
      const supportNeeds: SupportNeedsCache = {
        needs: [
          {
            supportNeedId: 12,
            otherSupportNeedText: 'Other custom support needs text',
            status: 'MET',
            isPrisonResponsible: true,
            isProbationResponsible: false,
            updateText: 'Text related to the update',
            uuid: '',
            existingPrisonerSupportNeedId: 0,
            title: '',
            category: '',
            allowUserDesc: false,
            isUpdatable: false,
            isSelected: false,
            isPreSelected: false,
          },
          {
            supportNeedId: 13,
            otherSupportNeedText: null,
            status: 'REQUIRED',
            isPrisonResponsible: true,
            isProbationResponsible: false,
            updateText: null,
            uuid: '',
            existingPrisonerSupportNeedId: 0,
            title: '',
            category: '',
            allowUserDesc: false,
            isUpdatable: false,
            isSelected: false,
            isPreSelected: false,
          },
          {
            supportNeedId: 14,
            otherSupportNeedText: 'Other custom support needs text',
            status: 'IN_PROGRESS',
            isPrisonResponsible: true,
            isProbationResponsible: false,
            updateText: null,
            uuid: '',
            existingPrisonerSupportNeedId: 0,
            title: '',
            category: '',
            allowUserDesc: false,
            isUpdatable: false,
            isSelected: false,
            isPreSelected: false,
          },
        ],
      }
      const ttl = 3600

      await supportNeedStateService.setSupportNeeds(key, supportNeeds, ttl)

      expect(setSupportNeedsSpy).toHaveBeenCalledWith(key, supportNeeds, ttl)
    })

    it('should throw an error if store fails to save support needs', async () => {
      const key = aStateKey(testPathway)
      const supportNeeds: SupportNeedsCache = {
        needs: [
          {
            supportNeedId: 12,
            otherSupportNeedText: 'Other custom support needs text',
            status: 'MET',
            isPrisonResponsible: true,
            isProbationResponsible: false,
            updateText: 'Text related to the update',
            uuid: '',
            existingPrisonerSupportNeedId: 0,
            title: '',
            category: '',
            allowUserDesc: false,
            isUpdatable: false,
            isSelected: false,
            isPreSelected: false,
          },
          {
            supportNeedId: 13,
            otherSupportNeedText: null,
            status: 'REQUIRED',
            isPrisonResponsible: true,
            isProbationResponsible: false,
            updateText: null,
            uuid: '',
            existingPrisonerSupportNeedId: 0,
            title: '',
            category: '',
            allowUserDesc: false,
            isUpdatable: false,
            isSelected: false,
            isPreSelected: false,
          },
          {
            supportNeedId: 14,
            otherSupportNeedText: 'Other custom support needs text',
            status: 'IN_PROGRESS',
            isPrisonResponsible: true,
            isProbationResponsible: false,
            updateText: null,
            uuid: '',
            existingPrisonerSupportNeedId: 0,
            title: '',
            category: '',
            allowUserDesc: false,
            isUpdatable: false,
            isSelected: false,
            isPreSelected: false,
          },
        ],
      }
      const ttl = 3600

      setSupportNeedsSpy.mockRejectedValueOnce(new Error('Redis save failed'))

      await expect(supportNeedStateService.setSupportNeeds(key, supportNeeds, ttl)).rejects.toThrow(
        'Failed to save support needs for key: {"prisonerNumber":"A1234DY","userId":"user123","pathway":"TEST_PATHWAY"}. Error: Redis save failed',
      )
    })
  })

  describe('getSupportNeeds', () => {
    it('should return support needs from the store', async () => {
      const key = aStateKey(testPathway)
      const supportNeeds: SupportNeedsCache = {
        needs: [
          {
            supportNeedId: 12,
            otherSupportNeedText: 'Other custom support needs text',
            status: 'MET',
            isPrisonResponsible: true,
            isProbationResponsible: false,
            updateText: 'Text related to the update',
            uuid: '',
            existingPrisonerSupportNeedId: 0,
            title: '',
            category: '',
            allowUserDesc: false,
            isUpdatable: false,
            isSelected: false,
            isPreSelected: false,
          },
          {
            supportNeedId: 13,
            otherSupportNeedText: null,
            status: 'REQUIRED',
            isPrisonResponsible: true,
            isProbationResponsible: false,
            updateText: null,
            uuid: '',
            existingPrisonerSupportNeedId: 0,
            title: '',
            category: '',
            allowUserDesc: false,
            isUpdatable: false,
            isSelected: false,
            isPreSelected: false,
          },
          {
            supportNeedId: 14,
            otherSupportNeedText: 'Other custom support needs text',
            status: 'IN_PROGRESS',
            isPrisonResponsible: true,
            isProbationResponsible: false,
            updateText: null,
            uuid: '',
            existingPrisonerSupportNeedId: 0,
            title: '',
            category: '',
            allowUserDesc: false,
            isUpdatable: false,
            isSelected: false,
            isPreSelected: false,
          },
        ],
      }

      getSupportNeedsSpy.mockResolvedValueOnce(supportNeeds)

      const result = await supportNeedStateService.getSupportNeeds(key)

      expect(result).toEqual(supportNeeds)
      expect(getSupportNeedsSpy).toHaveBeenCalledWith(key)
    })

    it('should throw an error if no support needs are found', async () => {
      const key = aStateKey(testPathway)

      getSupportNeedsSpy.mockResolvedValueOnce(null)

      await expect(supportNeedStateService.getSupportNeeds(key)).rejects.toThrow(
        'Support needs not found for key: {"prisonerNumber":"A1234DY","userId":"user123","pathway":"TEST_PATHWAY"}',
      )
    })
  })

  describe('deleteSupportNeeds', () => {
    it('should delete support needs from the store', async () => {
      const key = aStateKey(testPathway)
      jest.spyOn(store, 'deleteSupportNeeds').mockResolvedValueOnce()
      await supportNeedStateService.deleteSupportNeeds(key)
      expect(store.deleteSupportNeeds).toHaveBeenCalledWith(key)
    })
    it('should throw an error if store fails to delete support needs', async () => {
      const key = aStateKey(testPathway)
      jest.spyOn(store, 'deleteSupportNeeds').mockRejectedValueOnce(new Error('Redis delete failed'))
      await expect(supportNeedStateService.deleteSupportNeeds(key)).rejects.toThrow(
        'Failed to delete support needs for key: {"prisonerNumber":"A1234DY","userId":"user123","pathway":"TEST_PATHWAY"}. Error: Redis delete failed',
      )
    })
  })
})

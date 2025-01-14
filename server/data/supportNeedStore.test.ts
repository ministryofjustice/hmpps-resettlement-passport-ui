import { RedisClientType } from 'redis'
import SupportNeedStore, { StateKey } from './supportNeedStore'
import { SupportNeedsCache } from './model/supportNeeds'

describe('SupportNeedStore', () => {
  let mockRedisClient: Partial<Record<keyof RedisClientType, jest.Mock>>
  let supportNeedStore: SupportNeedStore

  const prefix = 'supportNeeds'
  const prisonerNumber = 'A1234DY'
  const userId = 'user123'
  const pathway = 'TEST_PATHWAY'

  const stateKey: StateKey = { prisonerNumber, userId, pathway }
  const supportNeeds: SupportNeedsCache = {
    needs: [
      {
        id: 12,
        otherSupportNeedText: 'Other custom support needs text',
        status: 'MET',
        isPrisonResponsible: true,
        isProbationResponsible: false,
        updateText: 'Text related to the update',
      },
    ],
  }

  beforeEach(() => {
    mockRedisClient = {
      connect: jest.fn(),
      set: jest.fn(),
      get: jest.fn(),
      del: jest.fn(),
      on: jest.fn(),
    }
    supportNeedStore = new SupportNeedStore(mockRedisClient as unknown as RedisClientType)
  })

  describe('setSupportNeeds', () => {
    it('should save support needs to Redis with the correct key and TTL', async () => {
      const ttl = 3600

      await supportNeedStore.setSupportNeeds(stateKey, supportNeeds, ttl)

      expect(mockRedisClient.connect).toHaveBeenCalled()
      expect(mockRedisClient.set).toHaveBeenCalledWith(
        `${prefix}:${userId}:${prisonerNumber}:${pathway}`,
        JSON.stringify(supportNeeds, null, 2),
        { EX: ttl },
      )
    })

    it('should throw an error if Redis set operation fails', async () => {
      ;(mockRedisClient.set as jest.Mock).mockRejectedValueOnce(new Error('Redis set error'))

      await expect(supportNeedStore.setSupportNeeds(stateKey, supportNeeds)).rejects.toThrow('Redis set error')
    })
  })

  describe('getSupportNeeds', () => {
    it('should retrieve support needs from Redis using the correct key', async () => {
      const redisValue = JSON.stringify(supportNeeds)
      ;(mockRedisClient.get as jest.Mock).mockResolvedValueOnce(redisValue)

      const result = await supportNeedStore.getSupportNeeds(stateKey)

      expect(mockRedisClient.connect).toHaveBeenCalled()
      expect(mockRedisClient.get).toHaveBeenCalledWith(`${prefix}:${userId}:${prisonerNumber}:${pathway}`)
      expect(result).toEqual(supportNeeds)
    })

    it('should return null and log an error if the key does not exist', async () => {
      ;(mockRedisClient.get as jest.Mock).mockResolvedValueOnce(null)

      const result = await supportNeedStore.getSupportNeeds(stateKey)

      expect(result).toBeNull()
    })

    it('should throw an error if Redis get operation fails', async () => {
      ;(mockRedisClient.get as jest.Mock).mockRejectedValueOnce(new Error('Redis get error'))

      await expect(supportNeedStore.getSupportNeeds(stateKey)).rejects.toThrow('Redis get error')
    })
  })

  describe('deleteSupportNeeds', () => {
    it('should delete support needs from Redis using the correct key', async () => {
      await supportNeedStore.deleteSupportNeeds(stateKey)

      expect(mockRedisClient.connect).toHaveBeenCalled()
      expect(mockRedisClient.del).toHaveBeenCalledWith(`${prefix}:${userId}:${prisonerNumber}:${pathway}`)
    })

    it('should throw an error if Redis delete operation fails', async () => {
      ;(mockRedisClient.del as jest.Mock).mockRejectedValueOnce(new Error('Redis delete error'))

      await expect(supportNeedStore.deleteSupportNeeds(stateKey)).rejects.toThrow('Redis delete error')
    })
  })
})

import { createRedisClient, RedisClient } from '../../server/data/redisClient'

export async function resetRedisCache() {
  const redisClient: RedisClient = createRedisClient()
  await redisClient.connect()

  const keys = await redisClient.keys('*USER1*')
  if (keys?.length > 0) {
    await redisClient.del(keys)
  }

  await redisClient.disconnect()
}

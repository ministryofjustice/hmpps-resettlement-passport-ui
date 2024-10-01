import { createRedisClient, RedisClient } from '../../server/data/redisClient'
import { WorkingCachedAssessment } from '../../server/data/model/immediateNeedsReport'

export async function resetRedisCache() {
  const redisClient: RedisClient = createRedisClient()
  await redisClient.connect()

  const keys = await redisClient.keys('*USER1*')
  if (keys?.length > 0) {
    await redisClient.del(keys)
  }

  await redisClient.disconnect()
}

export async function initRedisCache(pairs: { key: string; value: string }[]) {
  const redisClient: RedisClient = createRedisClient()
  await redisClient.connect()

  const redisSetPromises = pairs.map(async pair => {
    await redisClient.set(pair.key, pair.value)
  })

  await Promise.all(redisSetPromises)

  await redisClient.disconnect()
}

export async function initRedisCacheForNullExistingAssessment() {
  const workingAssessment: WorkingCachedAssessment = {
    assessment: {
      questionsAndAnswers: [
        {
          question: 'REGISTERED_WITH_GP',
          questionTitle: 'Is the person in prison registered with a GP surgery outside of prison?',
          questionType: 'RADIO',
          pageId: 'REGISTERED_WITH_GP',
          answer: { answer: 'YES', displayText: 'Yes', '@class': 'StringAnswer' },
        },
        {
          question: 'GP_PHONE_NUMBER',
          questionTitle: 'What is the phone number of the GP?',
          questionType: 'SHORT_TEXT',
          pageId: 'REGISTERED_WITH_GP',
          answer: { answer: '01234567890', displayText: '01234567890', '@class': 'StringAnswer' },
        },
      ],
      version: 1,
    },
    pageLoadHistory: [
      { pageId: 'REGISTERED_WITH_GP', questions: ['REGISTERED_WITH_GP', 'GP_PHONE_NUMBER'] },
      { pageId: 'MEET_HEALTHCARE_TEAM', questions: ['MEET_HEALTHCARE_TEAM'] },
    ],
  }

  await initRedisCache([
    {
      key: 'workingAssessment:BCST2:USER1:A8731DY:HEALTH',
      value: JSON.stringify(workingAssessment),
    },
  ])

  return null
}

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
  const currentPage = {
    id: 'MEET_HEALTHCARE_TEAM',
    title: null,
    questionsAndAnswers: [
      {
        question: {
          id: 'MEET_HEALTHCARE_TEAM',
          title: 'Does the person in prison want to meet with a prison healthcare team?',
          subTitle: null,
          type: 'RADIO',
          options: [
            { id: 'YES', displayText: 'Yes', description: null, exclusive: false, nestedQuestions: null },
            { id: 'NO', displayText: 'No', description: null, exclusive: false, nestedQuestions: null },
            {
              id: 'NO_ANSWER',
              displayText: 'No answer provided',
              description: null,
              exclusive: false,
              nestedQuestions: null,
            },
          ],
          validationType: 'MANDATORY',
        },
        answer: null,
        originalPageId: 'MEET_HEALTHCARE_TEAM',
      },
    ],
  }

  const assessment = {
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
  }

  const answered = ['REGISTERED_WITH_GP', 'GP_PHONE_NUMBER']

  initRedisCache([
    {
      key: 'currentPage:USER1:A8731DY:HEALTH',
      value: JSON.stringify(currentPage),
    },
    {
      key: 'assessment:USER1:A8731DY:HEALTH',
      value: JSON.stringify(assessment),
    },
    {
      key: 'answered:USER1:A8731DY:HEALTH',
      value: JSON.stringify(answered),
    },
  ])

  return null
}

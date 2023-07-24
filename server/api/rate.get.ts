import Redis from 'ioredis'
import { getRedisKey } from '../../utils'
import { H3Event } from 'h3'

export default defineEventHandler(async function (event: H3Event): Promise<unknown> {
  const redis: Redis = new Redis(process.env.REDIS_URL as string)
  const { uid } = getQuery(event)
  const redisKey = getRedisKey(uid as string)
  let data
  try {
    data = await redis.get(redisKey)
  } catch (error) {
    throw createError({
      statusCode: 400,
      statusMessage:
        'Failed to fetch stored data. ' + ((error as Error).message || Object.prototype.toString.call(error))
    })
  }
  redis.quit()
  setHeaders(event, {
    'content-type': 'application/json',
    'cache-control': 'public, s-maxage=1800, stale-while-revalidate=2400'
  })
  return data
})

import crypto from 'crypto'
import redis from 'redis'
import bluebird from 'bluebird'

bluebird.promisifyAll(redis.RedisClient.prototype)
/**
 * getCache
 */
async function getCache(redisClient, ctx, key) {
  let value = await redisClient.getAsync(key)
  let type
  if (value) {
    ctx.response.status = 200
    ctx.response.set('X-Jodel-Challenge-Cache', 'true')
    ctx.response.type = 'application/json'
    ctx.response.body = value
  } else {
    throw new Error(`no cached value found for cache key ${key}`)
  }
}

/**
 * setCache
 */
async function setCache(redisClient, ctx, key, expire) {
  let body = ctx.response.body

  if (ctx.request.method !== 'GET' || ctx.response.status !== 200 || !body) {
    return
  }
  if (typeof body === 'object' && ctx.response.type === 'application/json') {
    // json
    body = JSON.stringify(body)
    await redisClient.setAsync(key, body, 'EX', expire)
  } else {
    return
  }
}

const redisCache = ({
  prefix = 'jodel-redis-cache:',
  expire = 30 * 60, // 30 min
  redisURL = 'redis://localhost:6379/',
}) => {
  let redisAvailable = false
  /**
   * redisClient
   */
  const redisClient = redis.createClient(redisURL)
  redisClient.on('error', error => {
    redisAvailable = false
  })
  redisClient.on('end', () => {
    redisAvailable = false
  })
  redisClient.on('connect', () => {
    redisAvailable = true
  })

  return async function cache(ctx, next) {
    const { url, path } = ctx.request
    const key =
      prefix +
      crypto
        .createHash('md5')
        .update(url)
        .digest('hex')
    let match = false

    if (path === '/v1/books') {
      match = true
    }

    if (!redisAvailable || !match || ctx.request.method !== 'GET') {
      return await next()
    }

    try {
      await getCache(redisClient, ctx, key)
      return
    } catch (e) {}

    await next()
    if (redisAvailable) {
      try {
        await setCache(redisClient, ctx, key, expire)
      } catch (e) {}
    }
  }
}

export default redisCache

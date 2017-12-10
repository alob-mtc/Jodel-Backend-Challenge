import util from 'util'

const responseTime = opts => {
  opts = opts || {}
  const defaultLevel = opts.level || 'info'
  const requestTimeLevel = opts.timeLimit || 1000
  const logger = opts.logger

  return async (ctx, next) => {
    var start = Date.now()
    ctx.logger[defaultLevel]('----> Request Start')
    await next()
    const requestTime = Math.ceil(Date.now() - start)
    let localLevel = defaultLevel
    if (requestTime > requestTimeLevel) {
      localLevel = 'warn'
    }
    ctx.logger[localLevel]({ requestTime }, '<---- Request End')
    ctx.set('X-Response-Time', requestTime + 'ms')
  }
}

export default responseTime

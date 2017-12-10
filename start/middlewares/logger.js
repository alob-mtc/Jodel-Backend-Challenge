const logger = log => async (ctx, next) => {
  ctx.logger = log.child({
    httpRequest: {
      method: ctx.method,
      url: ctx.originalUrl,
      userAgent: ctx.get('user-agent'),
      referrer: ctx.get('referrer'),
      ip: ctx.ip,
    },
    requestId: ctx.requestId,
    user: ctx.get('user') || 'no-user-defined',
  })
  await next()
}

export default logger

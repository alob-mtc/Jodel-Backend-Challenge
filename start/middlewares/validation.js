const validation = () => async (ctx, next) => {
  try {
    await next()
  } catch (e) {
    if (e.name === 'RequestValidationError') {
      ctx.status = 400
      ctx.body = {
        message: e.message,
        data: e.data,
      }
    } else if (e.name === 'ResponseValidationError') {
      ctx.status = 500
      ctx.body = {
        message: e.message,
        data: e.data,
      }
    }
  }
}

export default validation

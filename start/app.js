import Koa from 'koa'
import router from './routes'
import middlewares from './middlewares'
import loadModels from '../lib/loadModels'
import config from '../config'

const app = async () => {
  const koa = new Koa()
  koa.context.db = await loadModels(config.database)
  koa.use(middlewares())
  koa.use(router.routes())
  koa.use(router.allowedMethods())

  koa.on('error', (err, ctx) => {
    ctx.logger.error('server error', err, ctx)
  })
  koa.listen(config.server.port, config.server.host)
}

export default app

import Koa from 'koa'
import router from './routes'
import middlewares from './middlewares'
import modelLoader from '../lib/modelLoader'
import config from '../config'

const app = async () => {
  const koa = new Koa()
  koa.context.db = await modelLoader({
    user: config.database.user,
    pass: config.database.password,
    host: config.database.host,
    port: config.database.port,
    database: config.database.name,
    schemas: './models',
    db: {
      native_parser: true,
    },
    server: {
      poolSize: config.database.poolSize,
    },
  })
  koa.use(middlewares())
  koa.use(router.routes())
  koa.use(router.allowedMethods())

  koa.on('error', (err, ctx) => {
    ctx.logger.error('server error', err, ctx)
  })
  koa.listen(3000)
}

export default app

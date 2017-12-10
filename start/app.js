import Koa from 'koa'
import joiSwagger from 'koa-joi-swagger'
import { toSwaggerDoc } from './docs/utils'
import docs from './docs'
import router from './routes'
import middlewares from './middlewares'
import loadModels from '../lib/loadModels'
import config from '../config'

const { ui } = joiSwagger
const swaggerDoc = toSwaggerDoc(docs)

const app = async () => {
  const koa = new Koa()
  koa.context.db = await loadModels(config.database)
  // mount swagger ui in `/swagger`
  koa.use(ui(swaggerDoc, { pathRoot: '/docs', v3: true }))
  koa.use(middlewares())
  koa.use(router.routes())
  koa.use(router.allowedMethods())

  koa.on('error', (err, ctx) => {
    ctx.logger.error(err, 'Server Error')
  })
  koa.listen(config.server.port, config.server.host)
}

export default app

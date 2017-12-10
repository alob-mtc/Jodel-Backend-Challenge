import Koa from 'koa'
import joiSwagger from 'koa-joi-swagger'
import toSwaggerDoc from '../lib/toSwaggerDoc'
import docs from './docs'
import routes, { allowedMethods } from './routes'
import middlewares from './middlewares'
import loadModels from '../lib/loadModels'
import config from '../config'

const { ui } = joiSwagger
const swaggerDoc = toSwaggerDoc(docs)

export default async () => {
  const app = new Koa()
  app.context.db = await loadModels(config.database)

  // mount swagger ui in `/swagger`
  app.use(ui(swaggerDoc, { pathRoot: '/docs', v3: true }))
  app.use(middlewares())
  app.use(routes())
  app.use(allowedMethods())

  app.on('error', (err, ctx) => {
    ctx.logger.error(err)
  })
  app.listen(config.server.port, config.server.host)
}

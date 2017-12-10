import bunyan from 'bunyan'
import Cors from '@koa/cors'
import BodyParser from 'koa-bodyparser'
import koaCompose from 'koa-compose'
// import camelCase from 'koa-camelcase-keys'

import config from '../../config'
import responseTime from './responseTime'
import requestId from './requestId'
import logger from './logger'

const log = bunyan.createLogger({ name: 'book', src: true })

const middlewares = () =>
  koaCompose([
    Cors(),
    requestId(),
    logger(log),
    responseTime({ logger: log }),
    BodyParser({
      enableTypes: ['json'],
    }),
    // camelCase(),
  ])

export default middlewares

import bunyan from 'bunyan'
import Cors from '@koa/cors'
import BodyParser from 'koa-bodyparser'
import koaCompose from 'koa-compose'
import joiSwagger from 'koa-joi-swagger'

import config from '../../config'
import responseTime from './responseTime'
import requestId from './requestId'
import logger from './logger'
import validation from './validation'
import redisCache from './redisCache'

import docs from '../docs'

const { mixedValidate } = joiSwagger

const log = bunyan.createLogger(config.logger)

const middlewares = () =>
  koaCompose([
    Cors(),
    requestId(),
    logger(log),
    responseTime({ logger: log }),
    BodyParser({
      enableTypes: ['json'],
    }),
    validation(),
    mixedValidate(docs, {
      onError: e => log.info(e, 'validation error'),
    }),
    redisCache({
      redisURL: config.redis.url,
    }),
  ])

export default middlewares

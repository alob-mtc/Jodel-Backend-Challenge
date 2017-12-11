const joi = require('joi')
const path = require('path')

const envVarsSchema = joi
  .object({
    NODE_ENV: joi
      .string()
      .allow(['development', 'production', 'test', 'staging'])
      .required(),
    PORT: joi.string().default('3000'),
    HOST: joi.string().default('127.0.0.1'),
    MONGO_PORT: joi.string().default('27017'),
    MONGO_HOST: joi.string().default('127.0.0.1'),
    MONGO_DB: joi.string().default('jodelBookStore'),
    MONGO_USER: joi.string().default(''),
    MONGO_PASSWORD: joi.string().default(''),
    MONGO_POOL_SIZE: joi.number().default(5),
    REDIS_PORT: joi.number().default(6379),
    REDIS_HOST: joi.string().default('127.0.0.1'),
    REDIS_DB: joi.number().default(0),

    LOGGER_LEVEL: joi
      .string()
      .allow(['error', 'warn', 'info', 'verbose', 'debug', 'silly'])
      .default('info'),
    LOGGER_STREAM: joi
      .string()
      .allow(['stream', 'file'])
      .default('stream'),
    LOGGER_NAME: joi.string().default('jodel-challenge'),
  })
  .unknown()
  .required()

const { error, value: envVars } = joi.validate(process.env, envVarsSchema)

if (error) {
  throw new Error(`Config validation error: ${error.message}`)
}

module.exports = {
  env: envVars.NODE_ENV,
  isTest: envVars.NODE_ENV === 'test',
  isDevelopment: envVars.NODE_ENV === 'development',
  logger: {
    name: envVars.LOGGER_NAME,
    src: true,
    streams: (() => {
      const stream = {
        level: envVars.LOGGER_LEVEL,
      }
      if (envVars.LOGGER_STREAM === 'stream') {
        stream.stream = process.stdout
      } else {
        stream.path = 'file.logger'
      }
      return [stream]
    })(),
  },
  database: {
    name: envVars.MONGO_DB,
    user: envVars.MONGO_USER,
    password: envVars.MONGO_PASSWORD,
    host: envVars.MONGO_HOST,
    port: envVars.MONGO_PORT,
    schemas: path.resolve(__dirname, '../models'),
    server: {
      poolSize: envVars.MONGO_POOL_SIZE,
    },
    db: {
      native_parser: true,
    },
  },
  redis: {
    host: envVars.REDIS_HOST,
    port: envVars.REDIS_PORT,
    db: envVars.REDIS_DB,
    url: `redis://${envVars.REDIS_HOST}:${envVars.REDIS_PORT}/${
      envVars.REDIS_DB
    }`,
  },
  server: {
    port: envVars.PORT,
    host: envVars.HOST,
  },
}

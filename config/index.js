const joi = require('joi')

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
    LOGGER_LEVEL: joi
      .string()
      .allow(['error', 'warn', 'info', 'verbose', 'debug', 'silly'])
      .default('info'),
    LOGGER_ENABLED: joi
      .boolean()
      .truthy('TRUE')
      .truthy('true')
      .falsy('FALSE')
      .falsy('false')
      .default(true),
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
    level: envVars.LOGGER_LEVEL,
    enabled: envVars.LOGGER_ENABLED,
  },
  database: {
    name: envVars.MONGO_DB,
    user: envVars.MONGO_USER,
    password: envVars.MONGO_PASSWORD,
    host: envVars.MONGO_HOST,
    port: envVars.MONGO_PORT,
    poolSize: envVars.MONGO_POOL_SIZE,
  },
  server: {
    port: envVars.PORT,
    host: envVars.HOST,
  },
}

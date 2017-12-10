require = require('@std/esm')(module)
const request = require('supertest')

const loadModels = require('./lib/loadModels').default
const server = require('./start/app').default

const config = require('./config')

beforeAll(async () => {
  // For some reason, the first call fails. So adding it here so that the test can work with subsequent calls
  await request(server).get('/v1/health')
  global.db = await loadModels(config.database)
})

afterAll(() => server.close())

afterEach(async () => {
  const models = Object.keys(db)
  for (const model of models) {
    await db[model].remove({})
  }
})

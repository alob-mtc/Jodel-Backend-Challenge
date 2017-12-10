require = require('@std/esm')(module)
const loadModels = require('./lib/loadModels').default
const config = require('./config')

beforeAll(async () => {
  global.db = await loadModels(config.database)
})

afterEach(async () => {
  const models = Object.keys(db)
  for (const model of models) {
    await db[model].remove({})
  }
})

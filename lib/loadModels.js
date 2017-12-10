import glob from 'glob'
import util from 'util'
import mongoose from 'mongoose'

mongoose.Promise = global.Promise

const connect = options => {
  if (!options || !options.host || !options.port) {
    throw new Error('options not found')
  }

  const uri = `mongodb://${options.user}:${options.password}@${options.host}:${
    options.port
  }/${options.name}`

  const db = mongoose.createConnection(uri, {
    server: options.server,
  })
  db.on('error', err => db.close())
  return db
}

const loader = async options => {
  const models = {}
  const db = await connect(options)

  let schemas =
    options.schemas +
    (options.schemas.lastIndexOf('/') === options.schemas.length - 1 ? '' : '/')
  const files = glob
    .sync(schemas + '/**/*.js')
    .filter(
      file =>
        file.slice(-8) !== '.spec.js' &&
        file.slice(-8) !== '.test.js' &&
        file.slice(-3) === '.js'
    )

  for (const file of files) {
    const model = file
      .replace(schemas, '')
      .replace(/\.js$/g, '')
      .replace(/\//g, '.')

    const { default: schema } = await import(file)
    models[model] = db.model(model, schema)
  }
  return models
}

export default loader

import glob from 'glob'
import util from 'util'
import mongoose from 'mongoose'

mongoose.Promise = global.Promise

const open = (db, options) => {
  if (!options || !options.host || !options.port) {
    throw new Error('options not found')
  }

  db.on('error', err => {
    db.close()
  })

  db.open(options.host, options.name, options.port, options)

  return db
}

const loader = async options => {
  const models = {}
  const db = mongoose.createConnection()

  open(db, options)

  let schemas =
    options.schemas +
    (options.schemas.lastIndexOf('/') === options.schemas.length - 1 ? '' : '/')
  const files = glob.sync(schemas + '/**/*.js')

  for (const file of files) {
    const model = file
      .replace(schemas, '')
      .replace(/\.js$/g, '')
      .replace(/\//g, '.')

    const { default: schema } = await import('.' + file)
    models[model] = db.model(model, schema)
  }
  return models
}

export default loader

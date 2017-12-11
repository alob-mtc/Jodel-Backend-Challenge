import loadModels from '../../lib/loadModels'
import Book from '../factories/Book'
import config from '../../config'
;(async () => {
  const db = await loadModels(config.database)
  const books = Book.buildList(process.argv[2] || 5)
  await db.Book.create(books)
  process.exit(0)
})()

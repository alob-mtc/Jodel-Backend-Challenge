require = require('@std/esm')(module)
const server = require('../start/app').default
const request = require('supertest')
const Book = require('../db/factories/Book').default

afterEach(() => {
  server.close()
})

describe('Routes', () => {
  describe('GET /v1/health', () => {
    test('should respond with healthy', async () => {
      const response = await request(server).get('/v1/health')
      expect(response.status).toEqual(200)
      expect(response.body.message).toEqual('healthy')
    })
  })

  describe('POST /v1/books', () => {
    test('should be successfull', async () => {
      const book = Book.build()
      const response = await request(server)
        .post('/v1/books')
        .send(book)
      expect(response.status).toEqual(200)
      expect(response.body).toMatchObject(book)
    })

    test('book title, genre and author is required to create a book', async () => {
      for (const field of ['title', 'genre', 'author']) {
        const book = Book.build()
        delete book[field]
        const response = await request(server)
          .post('/v1/books')
          .send(book)
        expect(response.status).toEqual(400)
        expect(response.body.message).toEqual(
          `request.body:child "${field}" fails because ["${field}" is required]`
        )
      }
    })

    test('description, pages, image_url and buy_url are not required to create a book', async () => {
      for (const field of ['description', 'pages', 'image_url', 'buy_url']) {
        const book = Book.build()
        delete book[field]
        const response = await request(server)
          .post('/v1/books')
          .send(book)
        expect(response.status).toEqual(200)
        expect(response.body).toMatchObject(book)
      }
    })

    test('valid url must be provided for image_url and buy_url', async () => {
      for (const field of ['image_url', 'buy_url']) {
        const book = Book.build()
        book[field] = 'some-invalid-url'
        const response = await request(server)
          .post('/v1/books')
          .send(book)
        expect(response.status).toEqual(400)
        expect(response.body.message).toEqual(
          `request.body:child "${field}" fails because ["${
            field
          }" must be a valid uri]`
        )
      }
    })
  })

  describe('GET /v1/books', () => {
    test('fetch books with default page and per_page', async () => {
      let books = Book.buildList(2)
      await db.Book.create(books)
      const response = await request(server).get('/v1/books')
      expect(response.status).toEqual(200)
      expect(response.body).toMatchObject({
        data: books,
        per_page: 10,
        page: 1,
        total: 2,
      })
    })

    test('fetch books with specified page and per_page', async () => {
      let books = Book.buildList(10)
      await db.Book.create(books)

      const response = await request(server).get('/v1/books?page=1&per_page=5')
      expect(response.status).toEqual(200)
      expect(response.body.data.length).toEqual(5)
      const { data, ...extra } = response.body
      data.forEach(item => delete item._id)
      expect({
        per_page: 5,
        page: 1,
        total: 10,
        data: books,
      }).toEqual({
        data: expect.arrayContaining(data),
        ...extra,
      })
    })

    test('can filter books by title, author and genre', async () => {
      let books = Book.buildList(3)

      const fields = ['title', 'author', 'genre']
      for (const i in fields) {
        const field = fields[i]
        books[i][field] = books[i][field] + 'make unique'
        const value = books[i][field]
        await db.Book.create(books)

        const response = await request(server).get(
          `/v1/books?${field}=${value}`
        )
        expect(response.status).toEqual(200)
        expect(response.body).toMatchObject({
          data: [books[i]],
          per_page: 10,
          page: 1,
          total: 1,
        })
      }
    })

    test('fail to filter books by any other field', async () => {
      let books = Book.buildList(3)
      await db.Book.create(books)
      const fields = ['description', 'image_url', 'some_field_not_in_schema']
      for (const i in fields) {
        const field = fields[i]
        const value = books[i][field]
        const response = await request(server).get(
          `/v1/books?${field}=${value}`
        )
        expect(response.status).toEqual(400)
        expect(response.body.message).toEqual(
          `request.query:"${field}" is not allowed`
        )
      }
    })
  })
})

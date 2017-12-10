const server = require('../server')
const request = require('supertest')

// close the server after each test
afterEach(() => {
  server.close()
})

describe('routes: index', () => {
  test('should respond as expected', async () => {
    const response = await request(server).get('/v1/health')
    expect(response.status).toEqual(200)
    expect(response.type).toEqual('application/json')
    expect(response.body.message).toEqual('healthy')
  })
})

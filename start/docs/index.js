import bookSchema from './books'

export default {
  swagger: '2.0',
  info: {
    title: 'Test API',
    description: 'Test API',
    version: '1.0.0',
  },
  //  the domain of the service
  //  host: 127.0.0.1:3457
  //  array of all schemes that your API supports
  schemes: ['http', 'https'],
  //  will be prefixed to all paths
  basePath: '/v1',
  // consumes: ['application/json'],
  produces: ['application/json'],
  paths: {
    ...bookSchema,
  },
}

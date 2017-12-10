import bookSchema from './books'

export default {
  swagger: '2.0',
  info: {
    title: 'Jodel BookStore API',
    description: 'BookStore API',
    version: '1.0.0',
  },

  schemes: ['http', 'https'],
  //  will be prefixed to all paths
  basePath: '/v1',
  consumes: ['application/json'],
  produces: ['application/json'],
  paths: {
    ...bookSchema,
  },
}

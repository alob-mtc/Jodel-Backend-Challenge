import joiSwagger from 'koa-joi-swagger'
import { page, pageQuery, Err, errorResponse } from './utils'
const { Joi } = joiSwagger.default

const BookCreate = Joi.object()
  .json()
  .keys({
    title: Joi.string()
      .required()
      .description('title of the book'),
    author: Joi.string()
      .required()
      .description('author who wrote the book'),
    genre: Joi.string()
      .required()
      .description('genre'),
    description: Joi.string().description('description'),
    publisher: Joi.string().description('publisher'),
    pages: Joi.number()
      .integer()
      .description('pages'),
    image_url: Joi.string()
      .uri()
      .description('image_url'),
    buy_url: Joi.string()
      .uri()
      .description('buy_url'),
    created_at: Joi.date(),
  })
  .description('Book')

const Book = BookCreate.concat(
  Joi.object()
    .json()
    .keys({
      _id: Joi.string()
        .force()
        .required()
        .description('_id'),
    })
)

export default {
  '/books': {
    get: {
      summary: 'List Books',
      tags: ['Book'],
      parameters: {
        query: pageQuery(),
      },
      responses: {
        '200': {
          schema: page(Book),
        },
        default: {
          description: 'failed to get books(4xx)',
          schema: Err,
        },
      },
    },
    post: {
      summary: 'Create a Book',
      description: 'Create a book',
      tags: ['Book'],
      parameters: {
        body: BookCreate,
      },
      responses: {
        '200': {
          description: 'A Book',
          schema: Book,
        },
        default: {
          description: 'Create Book (4xx)',
          schema: Err,
        },
      },
    },
  },
}

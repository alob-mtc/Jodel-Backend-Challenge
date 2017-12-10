import joiSwagger from 'koa-joi-swagger'

const { Joi } = joiSwagger.default

export function page(schema) {
  return Joi.object().keys({
    data: Joi.array()
      .items(schema)
      .required()
      .description('page list'),
    total: Joi.number()
      .integer()
      .required()
      .description('total item count'),
    per_page: Joi.number()
      .integer()
      .required()
      .description('item count per page'),
    page: Joi.number()
      .integer()
      .required()
      .description('page number, starts with 1'),
  })
}

export const Err = Joi.object()
  .json()
  .keys({
    message: Joi.string(),
    data: Joi.object(),
  })

export function pageQuery(schema = Joi.object()) {
  return Joi.object()
    .keys({
      page: Joi.number()
        .integer()
        .optional()
        .default(1)
        .description('page(starts with 1)'),
      per_page: Joi.number()
        .integer()
        .optional()
        .default(10)
        .description('per page'),
      genre: Joi.string()
        .optional()
        .description('genre'),
      author: Joi.string()
        .optional()
        .description('author'),
      title: Joi.string()
        .optional()
        .description('title'),
    })
    .concat(schema)
}

export const errorResponse = {
  default: {
    description: 'Error Response(4xx)',
    schema: Err,
  },
}

export function querySchema(schema) {
  return schema
}

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
    pages: Joi.string().description('pages'),
    image_url: Joi.string()
      .uri()
      .description('image_url'),
    buy_url: Joi.string()
      .uri()
      .description('buy_url'),
    created_at: Joi.date(),
  })
  .required()
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
      summary: '文章列表',
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
          description: '文章详情',
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

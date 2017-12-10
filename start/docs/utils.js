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

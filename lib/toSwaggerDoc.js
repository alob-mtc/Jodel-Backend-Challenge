import joi2jsonSchema from 'joi-to-json-schema'
import cloneDeepWith from 'lodash/cloneDeepWith'

const ctx2paramMap = {
  pathParams: 'path',
  query: 'query',
  headers: 'header',
  body: 'body',
}

const joiKey = 'jsonSchema'

const toSwaggerParams = joiMap => {
  let params = []
  Object.keys(joiMap).forEach(key => {
    const fullJsonSchema = joi2jsonSchema(joiMap[key])
    if (key === 'body') {
      const paramType = ctx2paramMap[key]
      const param = {
        name: key,
        allowEmptyValue: true,
        in: paramType,
        description: fullJsonSchema.description,
        required: true,
      }
      param.schema = fullJsonSchema
      params.push(param)
    } else {
      for (let name in fullJsonSchema.properties) {
        const jsonSchema = fullJsonSchema.properties[name]
        const paramType = ctx2paramMap[key]
        const param = {
          name,
          allowEmptyValue: true,
          in: paramType,
          required:
            fullJsonSchema.required &&
            fullJsonSchema.required.indexOf(name) >= 0,
        }
        if (paramType === 'body') {
          param.schema = jsonSchema
        } else {
          Object.assign(param, jsonSchema)
        }
        params.push(param)
      }
    }
  })
  params[joiKey] = joiMap
  return params
}

const toSwaggerDoc = mixedSchema => {
  const swaggerDoc = cloneDeepWith(mixedSchema, value => {
    if (typeof value === 'object' && value.isJoi === true) {
      return value.clone()
    }
  })
  for (let path in swaggerDoc.paths) {
    const pathInfo = swaggerDoc.paths[path]
    for (let method in pathInfo) {
      const methodInfo = pathInfo[method]
      methodInfo.parameters = toSwaggerParams(methodInfo.parameters)
      for (let status in methodInfo.responses) {
        const resInfo = methodInfo.responses[status]
        if (resInfo.schema && resInfo.schema.isJoi) {
          resInfo.schema = joi2jsonSchema(resInfo.schema)
        }
      }
    }
  }
  return swaggerDoc
}

export default toSwaggerDoc

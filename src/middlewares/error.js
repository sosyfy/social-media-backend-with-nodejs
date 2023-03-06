const httpStatus = require('http-status')
const openApiValidation = require(  'openapi-validator-middleware')
const { APIError } = require('#errors/common')

exports.errorHandlerMiddleware = function (err, req, res, _next) {


  if (err instanceof openApiValidation.InputValidationError) {
    return res.status(httpStatus.BAD_REQUEST).json({
      type: 'validation',
      title: 'Validation error',
      detail: err.message,
      invalidParams: err.errors,
    })
  }

  if (err instanceof APIError) {
    const status = err.status ?? 500
    return res.status(status).json({
      type: err.type,
      title: err.title ?? httpStatus[status],
      detail: err.detail,
    })
  }

  res.status(500).json({
    type: 'internal',
    title: 'Internal error',
  })
}

exports.notFoundMiddleware = function (req, res, next) {
  const err = new APIError({
    type: 'not_found',
    title: 'Not found',
    detail: '',
    status: httpStatus.NOT_FOUND,
  })

  next(err)
}

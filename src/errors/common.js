const httpStatus = require( 'http-status')

 class APIError extends Error {
  constructor(options) {
    const { type, title, detail, cause, status = httpStatus.INTERNAL_SERVER_ERROR } = options
    super(title, { cause })
    this.type = type
    this.title = title
    this.detail = detail
    this.status = status
  }
}

class ValidationError extends APIError {
  constructor(options) {
    const { invalidParams, ...rest } = options
    super(rest)
    this.invalidParams = invalidParams
  }
}

 class UserNotFoundError extends APIError {
  constructor(originalError) {
    super({
      type: 'user/not_found',
      title: 'User not found',
      status: httpStatus.NOT_FOUND,
      cause: originalError,
    })
  }
}

 class EmailAlreadyExistsError extends APIError {
  constructor(originalError) {
    super({
      type: 'user/invalid_email',
      title: '"email" already exists',
      status: httpStatus.CONFLICT,
      cause: originalError,
    })
  }
}

class IncorrectEmailOrPasswordError extends APIError {
  constructor(originalError) {
    super({
      type: 'auth/incorrect_credentials',
      title: 'Incorrect email or password',
      status: httpStatus.UNAUTHORIZED,
      cause: originalError,
    })
  }
}

module.exports = { IncorrectEmailOrPasswordError ,EmailAlreadyExistsError, APIError, UserNotFoundError ,ValidationError }
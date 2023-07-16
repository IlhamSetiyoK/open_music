const { postAuthenticationSchema, putAuthenticationSchema, deleteAuthenticationSchema } = require('./schema')
const InvariantError = require('../../exceptions/InvariantError')

const AuthenticationsValidator = {
  validatePostAuthenticationPayload: (payload) => {
    const validationResult = postAuthenticationSchema.validate(payload)
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  },
  validatePutAuthenticationPayload: (payload) => {
    const validationResult = putAuthenticationSchema.validate(payload)
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  },
  validateDeleteAuthenticationPayload: (payload) => {
    const validationResult = deleteAuthenticationSchema.validate(payload)
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  }
}

module.exports = AuthenticationsValidator

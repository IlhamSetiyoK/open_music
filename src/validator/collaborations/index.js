const InvariantError = require('../../exceptions/InvariantError')
const { postCollaborationPayloadSchema, deleteCollaborationPayloadSchema } = require('./schema')

const CollaborationsValidator = {
  validatePostCollaborationPayload: (payload) => {
    const validationResult = postCollaborationPayloadSchema.validate(payload)
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  },

  validateDeleteCollaborationPayload: (payload) => {
    const validationResult = deleteCollaborationPayloadSchema.validate(payload)
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  }
}

module.exports = CollaborationsValidator

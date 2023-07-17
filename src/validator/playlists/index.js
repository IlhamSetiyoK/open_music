const InvariantError = require('../../exceptions/InvariantError')
const { PlaylistPayLoadSchema } = require('./schema')

const PlaylistsValidator = {
  validatePlaylistPayLoad: (payload) => {
    const validationResult = PlaylistPayLoadSchema.validate(payload)
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  }
}

module.exports = PlaylistsValidator

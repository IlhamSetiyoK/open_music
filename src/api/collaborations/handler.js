const autoBind = require('auto-bind')

class CollaborationsHandler {
  constructor (CollaborationService, PlaylistsService, validator) {
    this._collaborationsService = CollaborationService
    this._playlistService = PlaylistsService
    this._validator = validator

    autoBind(this)
  }

  async postCollaborationHandler (request, h) {
    this._validator.validatePostCollaborationPayload(request.payload)
    const { playlistId, userId } = request.payload
    const { id: credentialId } = request.auth.credentials

    await this._playlistService.verifyPlaylistOwner(playlistId, credentialId)
    await this._playlistService.getPlaylistById(playlistId)
    const result = await this._collaborationsService.addCollaboration(playlistId, userId)

    const response = h.response({
      status: 'success',
      data: {
        collaborationId: result
      }
    })
    response.code(201)
    return response
  }

  async deleteCollaborationHandler (request, h) {
    const { playlistId, userId } = request.payload
    const { id: credentialId } = request.auth.credentials

    await this._playlistService.verifyPlaylistOwner(playlistId, credentialId)
    await this._collaborationsService.deleteCollaboration(playlistId, userId)

    return {
      status: 'success',
      message: 'Collaboration berhasil dihapus'
    }
  }
}
module.exports = CollaborationsHandler

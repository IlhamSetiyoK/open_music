const autoBind = require('auto-bind')

class PlaylistsHandler {
  constructor (service, validator) {
    this._service = service
    this._validator = validator

    autoBind(this)
  }

  async postPlaylistHandler (request, h) {
    this._validator.validatePlaylistPayload(request.payload)
    const playlistName = request.payload
    const { id: credentialId } = request.auth.credentials

    console.log(credentialId)

    const playlistId = await this._service.addPLaylist({ playlistName, owner: credentialId })

    const response = h.response({
      status: 'success',
      data: {
        playlistId
      }
    })
    response.code(201)
    return response
  }

  async getPlaylistsHandler (request, h) {
    const { id: credentialsId } = request.auth.credentials
    const playlists = await this._service.getPlaylists(credentialsId)

    return {
      status: 'success',
      data: {
        playlists
      }
    }
  }

  async deletePlaylistHandler (request, h) {
    const { playlistId } = request.params
    const { id: cresdentialsId } = request.auth.credentials
    await this._service.verifyPlaylistOwner(playlistId, cresdentialsId)
    await this._service.deletePlaylist(playlistId)

    return {
      status: 'success',
      message: 'Playlist berhasil dihapus'
    }
  }
}

module.exports = PlaylistsHandler

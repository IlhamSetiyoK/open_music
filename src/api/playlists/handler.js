const autoBind = require('auto-bind')

class PlaylistsHandler {
  constructor (service, validator) {
    this._service = service
    this._validator = validator

    autoBind(this)
  }

  async postPlaylistHandler (request, h) {
    this._validator.validatePlaylistPayLoad(request.payload)
    const { name } = request.payload
    const { id: credentialId } = request.auth.credentials

    const playlistId = await this._service.addPlaylist({ playlistName: name, owner: credentialId })

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
    const { id: credentialId } = request.auth.credentials
    const playlists = await this._service.getPlaylists(credentialId)

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

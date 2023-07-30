const autoBind = require('auto-bind')

class PlaylistsHandler {
  constructor (service, validator) {
    this._service = service
    this._validator = validator

    autoBind(this)
  }

  // Code for CRUD Playlist
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
    const { id } = request.params
    const { id: credentialId } = request.auth.credentials

    await this._service.verifyPlaylistOwner(id, credentialId)
    await this._service.deletePlaylist(id)

    return {
      status: 'success',
      message: 'Playlist berhasil dihapus'
    }
  }

  // Code for CRUD Song inside Playlist
  async postPlaylistSongHandler (request, h) {
    this._validator.validatePlaylistSongPayLoad(request.payload)
    const { id } = request.params
    const { songId } = request.payload
    const { id: credentialId } = request.auth.credentials

    await this._service.playlistAccessUser(credentialId, id)
    const result = await this._service.addPlaylistSong(id, songId, credentialId)

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan kedalam playlist',
      data: {
        result
      }
    })

    response.code(201)
    return response
  }

  async getPlaylistSongsHandler (request, h) {
    const { id } = request.params
    const { id: credentialId } = request.auth.credentials

    const playlistData = await this._service.getPlaylistById(id)

    await this._service.playlistAccessUser(credentialId, id)
    const song = await this._service.getPlaylistSongs(id)

    const mapResult = song.map((song) => ({
      id: song.id,
      title: song.title,
      performer: song.performer
    }))

    return {
      status: 'success',
      data: {
        playlist: {
          ...playlistData,
          songs: mapResult
        }
      }
    }
  }

  async deletePlaylistSongHandler (request, h) {
    const { id } = request.params
    const { songId } = request.payload
    const { id: credentialId } = request.auth.credentials

    await this._service.playlistAccessUser(credentialId, id)
    await this._service.deletePlaylistSong(id, songId, credentialId)

    return {
      status: 'success',
      message: 'Playlist song berhasil dihapus'
    }
  }

  // Code for getting All activities inside playlist
  async getPlaylistActivitiesHandler (request, h) {
    const { id } = request.params
    const { id: credentialId } = request.auth.credentials

    await this._service.playlistAccessUser(credentialId, id)
    const result = await this._service.getPlaylistActivities(id)

    return {
      status: 'success',
      data: {
        playlistId: id,
        activities: result
      }
    }
  }
}

module.exports = PlaylistsHandler

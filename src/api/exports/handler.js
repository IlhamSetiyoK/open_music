const autoBind = require('auto-bind')

class ExportsHandler {
  constructor (exportsService, playlistsService, validator) {
    this._exportService = exportsService
    this._playlistService = playlistsService
    this._validator = validator

    autoBind(this)
  }

  async postExportPlaylistHandler (request, h) {
    this._validator.validateExportPlaylistsPayload(request.payload)
    const { id: playlistId } = request.params
    const { id: credentialId } = request.auth.credentials

    await this._playlistService.verifyPlaylistOwner(playlistId, credentialId)

    const message = {
      userId: credentialId,
      playlistId,
      targetEmail: request.payload.targetEmail
    }

    await this._exportService.sendMessage('export:playlists', JSON.stringify(message))

    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda sedang kami proses'
    })

    response.code(201)
    return response
  }
}

module.exports = ExportsHandler

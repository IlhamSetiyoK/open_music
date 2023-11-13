const autoBind = require('auto-bind')

class AlbumLikesHandler {
  constructor (service) {
    this._service = service

    autoBind(this)
  }

  async postAlbumLikeByIdHandler (request, h) {
    const { id } = request.params
    const { id: credentialId } = request.auth.credentials

    const check = await this._service.validateAlbumLike(id, credentialId)

    if (check === 0) {
      await this._service.addAlbumLike(id, credentialId)

      const response = h.response({
        status: 'success',
        message: 'Album suka',
        data: {
          userId: credentialId,
          albumId: id
        }
      })

      response.code(201)
      return response
    }

    const response = h.response({
      status: 'fail',
      message: 'Anda telah menyukai album ini'
    })
    response.code(400)
    return response
  }

  async getAlbumLikesByIdHandler (request, h) {
    const { id } = request.params
    const { data, from } = await this._service.getAlbumLikesByAlbumId(id)

    if (from === 'cache') {
      const response = h.response({
        status: 'success',
        data: {
          likes: data
        }
      })
      response.code(200)
      response.header('X-Data-Source', from)
      return response
    }

    const response = h.response({
      status: 'success',
      data: {
        likes: data
      }
    })
    response.code(200)
    return response
  }

  async deleteAlbumLikeByIdHandler (request, h) {
    const { id } = request.params
    const { id: credentialId } = request.auth.credentials

    await this._service.deleteAlbumLike(id, credentialId)
    return {
      status: 'success',
      message: 'Album suka berhasil dihapus'
    }
  }
}

module.exports = AlbumLikesHandler

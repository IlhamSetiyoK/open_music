require('dotenv').config()

const autoBind = require('auto-bind')

class UploadHandler {
  constructor (albumsService, storagesService, validator) {
    this._albumsService = albumsService
    this._storagesService = storagesService
    this._validator = validator

    autoBind(this)
  }

  async postUploadAlbumImageHandler (request, h) {
    const { id } = request.params
    const { cover } = request.payload

    this._validator.validateImageHeaders(cover.hapi.headers)

    const filename = await this._storagesService.writeFile(cover, cover.hapi, id)
    // const imgUrl = `http://${process.env.HOST}:${process.env.PORT}/albums/${id}/covers/${filename}`

    await this._albumsService.addAlbumCover(id, filename)

    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah'
    })
    response.code(201)
    return response
  }
}

module.exports = UploadHandler

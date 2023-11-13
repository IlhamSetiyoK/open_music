const { nanoid } = require('nanoid')
const { Pool } = require('pg')
const InvariantError = require('../../exceptions/InvariantError')
const NotFoundError = require('../../exceptions/NotFoundError')

class AlbumsService {
  constructor (songsService) {
    this._pool = new Pool()
    this._songsService = songsService
  }

  async addAlbum ({ name, year }) {
    const id = `album-${nanoid(16)}`
    const createdAt = new Date().toISOString()
    const updatedAt = createdAt

    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, name, year, createdAt, updatedAt]
    }

    const result = await this._pool.query(query)

    if (!result.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan')
    }

    return result.rows[0].id
  }

  async getAlbums () {
    const query = {
      text: 'SELECT * FROM albums'
    }

    const result = await this._pool.query(query)
    return result.rows
  }

  async getAlbumById (id) {
    const albumData = {
      text: 'SELECT id, name, year, cover FROM albums WHERE id = $1',
      values: [id]
    }

    const resultAlbum = await this._pool.query(albumData)

    if (!resultAlbum.rowCount) {
      throw new NotFoundError('Album tidak ditemukan')
    }

    const resultSongs = await this._songsService.getSongsByAlbumId(id)

    const final = {
      ...resultAlbum.rows[0],
      songs: resultSongs
    }

    return final
  }

  async editAlbumById (id, { name, year }) {
    const updatedAt = new Date().toISOString()

    const query = {
      text: 'UPDATE albums SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id',
      values: [name, year, updatedAt, id]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('Gagal memperbarui album, Id tidak ditemukan')
    }
  }

  async deleteAlbumById (id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('Gagal menghapus album, Id tidak ditemukan')
    }
  }

  async addAlbumCover (id, cover) {
    const query = {
      text: 'UPDATE albums SET cover = $1 WHERE id = $2 RETURNING id',
      values: [cover, id]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('Gagal mengubah album, Id tidak ditemukan')
    }
  }
}

module.exports = AlbumsService

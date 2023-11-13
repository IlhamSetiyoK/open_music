const { Pool } = require('pg')
const { nanoid } = require('nanoid')
const InvariantError = require('../../exceptions/InvariantError')

class AlbumLikesService {
  constructor (cacheService, albumsService) {
    this._pool = new Pool()
    this._cacheService = cacheService
    this._albumsService = albumsService
  }

  async addAlbumLike (albumId, userId) {
    await this._albumsService.getAlbumById(albumId)

    const id = `like-${nanoid(16)}`
    const query = {
      text: 'INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id',
      values: [id, userId, albumId]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new InvariantError('Gagal menyukai album')
    }

    this._cacheService.delete(`likes:${albumId}`)
  }

  async deleteAlbumLike (albumId, userId) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id',
      values: [userId, albumId]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new InvariantError('Gagal menghapus suka album')
    }

    await this._cacheService.delete(`likes:${albumId}`)
  }

  async getAlbumLikesByAlbumId (albumId) {
    try {
      const result = await this._cacheService.get(`likes:${albumId}`)
      return {
        data: parseInt(JSON.parse(result)),
        from: 'cache'
      }
    } catch (error) {
      const query = {
        text: 'SELECT count(user_id) FROM user_album_likes WHERE album_id = $1',
        values: [albumId]
      }

      const result = await this._pool.query(query)

      await this._cacheService.set(`likes:${albumId}`, JSON.stringify(result.rows[0].count))

      return {
        data: parseInt(result.rows[0].count),
        from: 'db'
      }
    }
  }

  async validateAlbumLike (albumId, userId) {
    const query = {
      text: 'SELECT * FROM user_album_likes WHERE album_id = $1 AND user_id = $2',
      values: [albumId, userId]
    }

    const result = await this._pool.query(query)

    return result.rowCount
  }
}

module.exports = AlbumLikesService

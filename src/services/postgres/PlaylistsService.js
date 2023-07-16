const { nanoid } = require('nanoid')
const { Pool } = require('pg')
const InvariantError = require('../../exceptions/InvariantError')
const AuthorizationError = require('../../exceptions/AuthorizationError')

class PlaylistsService {
  constructor () {
    this._pool = new Pool()
  }

  async addPlaylist (playlistName, userId) {
    const id = `playlist-${nanoid(16)}`
    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistName, userId]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new InvariantError('Playlist gagal ditambahkan')
    }

    return result.rows[0].id
  }

  async getPlaylists (userId) {
    const query = {
      text: 'SELECT * FROM playlists WHERE user_id = $1',
      values: [userId]
    }

    const result = await this._pool.query(query)

    return result.rows
  }

  async deletePlaylist (playlistId) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [playlistId]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new InvariantError('Playlist gagal dihapus, Id tidak ditemukan')
    }
  }

  async verifyPlaylistOwner (playlistId, owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [playlistId]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new InvariantError('Playlist tidak ditemukan')
    }

    const playlist = result.rows[0]

    if (playlist.userId !== owner) {
      throw new AuthorizationError('Anda tidak memiliki akses untuk resource ini')
    }
  }
}

module.exports = PlaylistsService

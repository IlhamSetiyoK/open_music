const { Pool } = require('pg')
const InvariantError = require('../../exceptions/InvariantError')
const { nanoid } = require('nanoid')

class CollaborationsService {
  constructor (UsersService) {
    this._pool = new Pool()
    this._usersService = UsersService
  }

  async addCollaboration (playlistId, userId) {
    await this._usersService.verifyUserById(userId)
    const id = `collab-${nanoid(16)}`
    const query = {
      text: 'INSERT INTO collaborations VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, userId]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new InvariantError('Collaboration gagal ditambahkan')
    }

    return result.rows[0].id
  }

  async deleteCollaboration (playlistId, userId) {
    const query = {
      text: 'DELETE FROM collaborations WHERE playlist_id = $1 AND user_id = $2 RETURNING id',
      values: [playlistId, userId]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new InvariantError('Collaboration gagal dihapus, id tidak ditemukan')
    }
  }

  async verifyCollaboration (playlistId, userId) {
    const query = {
      text: 'SELECT * from collaborations WHERE playlist_id = $1 AND user_id = $2',
      values: [playlistId, userId]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new InvariantError('Collaboration tidak ditemukan')
    }
  }
}

module.exports = CollaborationsService

const InvariantError = require('../../exceptions/InvariantError')
const AuthenticationError = require('../../exceptions/AuthenticationError')
const NotFoundError = require('../../exceptions/NotFoundError')

const { nanoid } = require('nanoid')
const bcrypt = require('bcrypt')
const { Pool } = require('pg')

class UsersService {
  constructor () {
    this._pool = new Pool()
  }

  async verifyUsername (username) {
    const query = {
      text: 'SELECT * FROM users WHERE username = $1',
      values: [username]
    }

    const result = await this._pool.query(query)

    if (result.rowCount) {
      throw new InvariantError('Username sudah digunakan')
    }
  }

  async verifyUserById (id) {
    const query = {
      text: 'SELECT * FROM users WHERE id = $1',
      values: [id]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('User tidak ditemukan')
    }
  }

  async addUser (username, password, fullname) {
    await this.verifyUsername(username)

    const id = `user-${nanoid(16)}`
    const hashPassword = await bcrypt.hash(password, 10)

    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, username, hashPassword, fullname]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new InvariantError('User gagal ditambahkan')
    }

    return result.rows[0].id
  }

  async getUserById (id) {
    const query = {
      text: 'SELECT * FROM users WHERE id = $1',
      values: [id]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new InvariantError('User tidak ditemukan')
    }

    return result.rows[0]
  }

  async verifyUserCredentials (username, password) {
    const query = {
      text: 'SELECT id, password FROM users WHERE username = $1',
      values: [username]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new AuthenticationError('Kredensial tidak valid')
    }

    const { id, password: hashPassword } = result.rows[0]

    const matches = await bcrypt.compare(password, hashPassword)

    if (!matches) {
      throw new AuthenticationError('Kredensial tidak valid')
    }

    return id
  }
}

module.exports = UsersService

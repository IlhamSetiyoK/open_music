const ClientError = require('./ClientError')

class AuthorizationError extends ClientError {
  constructor (message) {
    super(message)
    this.statuscode = 403
    this.name = 'AuthorizationError'
  }
}

module.exports = AuthorizationError

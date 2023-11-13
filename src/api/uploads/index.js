const UploadHandler = require('./handler')
const routes = require('./routes')

module.exports = {
  name: 'uploads',
  version: '1.0.0',
  register: async (server, { albumsService, storagesService, validator }) => {
    const uploadsHandler = new UploadHandler(albumsService, storagesService, validator)
    server.route(routes(uploadsHandler))
  }
}

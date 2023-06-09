require('dotenv').config()
const Hapi = require('@hapi/hapi')
const albums = require('./api/albums')
const songs = require('./api/songs')
const AlbumsService = require('./services/postgres/AlbumsService')
const SongsService = require('./services/postgres/SongsService')
const AlbumsValidator = require('./validator/albums')
const SongsValidator = require('./validator/songs')

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*']
      }
    }
  })

  await server.register([
    {
      plugin: albums,
      options: {
        service: AlbumsService,
        validator: AlbumsValidator
      }
    },
    {
      plugin: songs,
      options: {
        service: SongsService,
        validator: SongsValidator
      }
    }
  ])

  await server.start()
  console.log(`Server berjalan pada ${server.info.uri}`)
}

init()

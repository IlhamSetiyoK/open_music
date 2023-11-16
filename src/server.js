require('dotenv').config()
const Hapi = require('@hapi/hapi')
const Jwt = require('@hapi/jwt')
const path = require('path')
const inert = require('@hapi/inert')

const albums = require('./api/albums')
const AlbumsService = require('./services/postgres/AlbumsService')
const AlbumsValidator = require('./validator/albums')

const songs = require('./api/songs')
const SongsService = require('./services/postgres/SongsService')
const SongsValidator = require('./validator/songs')

const users = require('./api/users')
const UsersService = require('./services/postgres/UsersService')
const UsersValidator = require('./validator/users')

const authentications = require('./api/authentications')
const AuthenticationsService = require('./services/postgres/AuthenticationsService')
const AuthenticationsValidator = require('./validator/authentications')

const playlists = require('./api/playlists')
const PlaylistsService = require('./services/postgres/PlaylistsService')
const PlaylistsValidator = require('./validator/playlists')

const collaborations = require('./api/collaborations')
const CollaborationsService = require('./services/postgres/CollaborationsService')
const CollaborationsValidator = require('./validator/collaborations')

const uploads = require('./api/uploads')
const UploadsService = require('./services/storage/StorageService')
const UploadsValidator = require('./validator/uploads')

const albumlikes = require('./api/albumLikes')
const AlbumLikesService = require('./services/postgres/AlbumLikesService')

const _export = require('./api/exports')
const ProducersService = require('./services/rabbitmq/ProducerService')
const ExportsValidator = require('./validator/exports')

const CacheService = require('./services/redis/CacheService')

const ActivitiesService = require('./services/postgres/ActivitiesService')

const ClientError = require('./exceptions/ClientError')

const TokenManager = require('./tokenize/TokenManager')

const init = async () => {
  // Cache Services
  const cacheService = new CacheService()

  // Song Services
  const songsService = new SongsService()

  // Album Service
  const albumsService = new AlbumsService(songsService)

  // User Service
  const usersService = new UsersService()

  // Authentications Service
  const authenticationsService = new AuthenticationsService()

  // Collaborations Service
  const collaborationsService = new CollaborationsService(usersService)

  // Activities Service
  const activitiesService = new ActivitiesService()

  // Playlists Service
  const playlistsService = new PlaylistsService(songsService, collaborationsService, activitiesService)

  // Uploads Service
  const uploadsService = new UploadsService(path.resolve(__dirname, 'api/uploads/file/cover'))

  // Album Likes Service
  const albumLikesService = new AlbumLikesService(cacheService, albumsService)

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
      plugin: Jwt
    },
    {
      plugin: inert
    }
  ])

  server.auth.strategy('openmusic_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE
    },
    validate: (artifact) => ({
      isValid: true,
      credentials: {
        id: artifact.decoded.payload.id
      }
    })
  })

  await server.register([
    {
      plugin: albums,
      options: {
        service: albumsService,
        validator: AlbumsValidator
      }
    },
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongsValidator
      }
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator
      }
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator
      }
    },
    {
      plugin: playlists,
      options: {
        service: playlistsService,
        validator: PlaylistsValidator
      }
    },
    {
      plugin: collaborations,
      options: {
        collaborationsService,
        playlistsService,
        validator: CollaborationsValidator
      }
    },
    {
      plugin: _export,
      options: {
        exportsService: ProducersService,
        playlistService: playlistsService,
        validator: ExportsValidator
      }
    },
    {
      plugin: uploads,
      options: {
        albumsService,
        storagesService: uploadsService,
        validator: UploadsValidator
      }
    },
    {
      plugin: albumlikes,
      options: {
        service: albumLikesService
      }
    }
  ])

  server.ext('onPreResponse', (request, h) => {
    const { response } = request

    if (response instanceof Error) {
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message
        })
        newResponse.code(response.statuscode)
        return newResponse
      }

      if (!response.isServer) {
        return h.continue
      }

      const newResponse = h.response({
        status: 'error',
        message: 'Maaf terjadi kegagalan pada server kami'
      })
      newResponse.code(500)
      console.error(response)
      return newResponse
    }

    return h.continue
  })

  await server.start()
  console.log(`Server berjalan pada ${server.info.uri}`)
}

init()

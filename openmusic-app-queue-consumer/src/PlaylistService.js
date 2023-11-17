const { Pool } = require('pg')

class PlaylistsService {
  constructor () {
    this._pool = new Pool()
  }

  async getPlaylists (playlistId) {
    const queryPlaylist = {
      text: `SELECT id, name from playlists
             WHERE id = $1`,
      values: [playlistId]
    }

    const resultPlaylist = await this._pool.query(queryPlaylist)

    const querySongs = {
      text: `SELECT b.id, b.title, b.performer 
             FROM playlist_songs a 
             LEFT JOIN songs b ON a.song_id = b.id 
             WHERE a.playlist_id = $1`,
      values: [playlistId]
    }

    const resultSong = await this._pool.query(querySongs)

    return { playlist: { ...resultPlaylist.rows[0], songs: resultSong.rows } }
  }
}

module.exports = PlaylistsService

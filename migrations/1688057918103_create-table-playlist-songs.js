/* eslint-disable camelcase */

exports.up = pgm => {
  pgm.createTable('playlist_songs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'playlists(id)',
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    },
    song_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'songs(id)',
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    }
  })
}

exports.down = pgm => {
  pgm.dropTable('playlist_songs')
}

/* eslint-disable camelcase */

exports.up = pgm => {
  pgm.createTable('playlist_song_activities', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'playlists(id)',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    song_id: {
      type: 'VARCHAR(50)',
      notNull: true
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true
    },
    action: {
      type: 'VARCHAR(50)',
      notNull: true
    },
    time: {
      type: 'VARCHAR(50)',
      notNull: true
    }
  })
}

exports.down = pgm => {
  pgm.dropTable('playlist_song_activities')
}

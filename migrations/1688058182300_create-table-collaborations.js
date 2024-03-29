/* eslint-disable camelcase */

exports.up = pgm => {
  pgm.createTable('collaborations', {
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
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'users(id)',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    }
  })
}

exports.down = pgm => {
  pgm.dropTable('collaborations')
}

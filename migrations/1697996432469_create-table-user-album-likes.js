/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = pgm => {
  pgm.createTable('user_album_likes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'users(id)',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    album_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'albums(id)',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    }
  })
}

exports.down = pgm => {
  pgm.dropTable('user_album_likes')
}

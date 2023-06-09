/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = pgm => {
  pgm.createTable('songs', {
    id: {
      type: 'VARCHAR(25)',
      primaryKey: true
    },
    title: {
      type: 'VARCHAR(50)',
      notNull: true
    },
    year: {
      type: 'INT',
      notNull: true
    },
    genre: {
      type: 'VARCHAR(50)',
      notNull: true
    },
    performer: {
      type: 'VARCHAR(50)',
      notNull: true
    },
    duration: {
      type: 'INT',
      notNull: true
    },
    albumId: {
      type: 'VARCHAR(25)',
      notNull: true,
      references: 'albums(id)',
      onDelete: 'CASCADE'
    },
    created_at: {
      type: 'TEXT',
      notNull: true
    },
    updated_at: {
      type: 'TEXT',
      notNull: true
    }
  })
}

exports.down = pgm => {
  pgm.dropTable('songs')
}

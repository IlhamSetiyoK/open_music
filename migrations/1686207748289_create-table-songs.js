/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = pgm => {
  pgm.createTable('albums', {
    id: {
      type: 'VARCHAR(25)',
      primaryKey: true
    },
    name: {
      type: 'VARCHAR(50)',
      notNull: true
    },
    year: {
      type: 'INT',
      notNull: true
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
    album_id: {
      type: 'VARCHAR(25)',
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
  pgm.dropTable('albums')
}

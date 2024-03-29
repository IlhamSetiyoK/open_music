/* eslint-disable camelcase */

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
}

exports.down = pgm => {
  pgm.dropTable('albums')
}

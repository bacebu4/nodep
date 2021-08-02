'use strict';

const queryBuilder = require('../../lib/sql/QueryBuilder');

describe('query builder', () => {
  describe('select query', () => {
    const cases = [
      [{ tableName: 'users' }, 'SELECT * FROM users'],
      [
        { tableName: 'users', fields: ['email', 'name'] },
        'SELECT "email", "name" FROM users',
      ],
      [{ tableName: 'users', fields: ['email'] }, 'SELECT "email" FROM users'],
    ];

    it.each(cases)('when given %j produces %s', (given, expected) => {
      const res = queryBuilder.select(given);

      expect(res.sql).toEqual(expected);
    });
  });
});

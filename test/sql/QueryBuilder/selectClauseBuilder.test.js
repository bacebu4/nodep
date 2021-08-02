'use strict';

const selectClauseBuilder = require('../../../lib/sql/QueryBuilder/selectClauseBuilder');

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
    const res = selectClauseBuilder(given);

    expect(res.clause).toEqual(expected);
  });
});

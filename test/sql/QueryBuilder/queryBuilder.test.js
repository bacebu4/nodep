'use strict';

const queryBuilder = require('../../../lib/sql/QueryBuilder/QueryBuilder');

describe('query builder', () => {
  it('correctly produce `select` query without `where` condition', () => {
    const { sql, args } = queryBuilder.select({ tableName: 'users' });

    expect(sql).toBe('SELECT * FROM users');
    expect(args).toEqual([]);
  });

  it('correctly produce `select` query with `where` condition', () => {
    const { sql, args } = queryBuilder.select({
      tableName: 'users',
      where: { id: 1, name: 'john' },
    });

    expect(sql).toBe('SELECT * FROM users WHERE "id" = $1 AND "name" = $2');
    expect(args).toEqual([1, 'john']);
  });
});

'use strict';

const queryBuilder = require('../../lib/sql/QueryBuilder');
const {
  WhereClauseBuilder,
} = require('../../lib/sql/QueryBuilder/WhereClauseBuilder');

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

  describe('where clause builder', () => {
    const cases = [
      [{ id: 1 }, [' WHERE "id" = $1', [1]]],
      [{ age: '>10' }, [' WHERE "age" > $1', ['10']]],
      [{ age: '<10' }, [' WHERE "age" < $1', ['10']]],
      [{ age: '<=10' }, [' WHERE "age" <= $1', ['10']]],
      [{ age: '>=10' }, [' WHERE "age" >= $1', ['10']]],
      [{ age: '<>10' }, [' WHERE "age" <> $1', ['10']]],
      [{ age: '>10', id: 2 }, [' WHERE "age" > $1 AND "id" = $2', ['10', 2]]],
      [{ name: '*as' }, [' WHERE "name" LIKE $1', ['%as']]],
      [{ name: 'v?as' }, [' WHERE "name" LIKE $1', ['v_as']]],
      [
        { name: 'v?as', id: '2' },
        [' WHERE "name" LIKE $1 AND "id" = $2', ['v_as', '2']],
      ],
    ];

    it.each(cases)(
      'when given %j produces %j',
      (given, [expectedClause, expectedArgs]) => {
        const res = new WhereClauseBuilder(given);

        expect(res.clause).toEqual(expectedClause);
        expect(res.args).toEqual(expectedArgs);
      }
    );

    it('mind the offset', () => {
      const res = new WhereClauseBuilder({ age: '>10', id: 2 }, 1);

      expect(res.clause).toEqual(' WHERE "age" > $2 AND "id" = $3');
      expect(res.args).toEqual(['10', 2]);
    });
  });
});

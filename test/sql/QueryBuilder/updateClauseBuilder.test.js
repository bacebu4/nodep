'use strict';

const updateClauseBuilder = require('../../../lib/sql/QueryBuilder/updateClauseBuilder');

describe('select query', () => {
  const cases = [
    [
      { tableName: 'users', delta: { id: 1, name: 'john' } },
      ['UPDATE "users" SET "id" = $1, "name" = $2', [1, 'john']],
    ],
  ];

  it.each(cases)(
    'when given %j produces %s',
    (given, [expectedClause, expectedArgs]) => {
      const { clause, args } = updateClauseBuilder(given);

      expect(clause).toEqual(expectedClause);
      expect(args).toEqual(expectedArgs);
    }
  );
});

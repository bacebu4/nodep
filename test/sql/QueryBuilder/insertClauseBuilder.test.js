'use strict';

const insertClauseBuilder = require('../../../lib/sql/QueryBuilder/insertClauseBuilder');

describe('insert builder', () => {
  const cases = [
    [
      { tableName: 'users', record: { id: 1, name: 'john' } },
      ['INSERT INTO "users" ("id", "name") VALUES ($1, $2)', [1, 'john']],
    ],
  ];

  it.each(cases)(
    'when given %j produces %s',
    (given, [expectedClause, expectedArgs]) => {
      const { clause, args } = insertClauseBuilder(given);

      expect(clause).toEqual(expectedClause);
      expect(args).toEqual(expectedArgs);
    }
  );
});

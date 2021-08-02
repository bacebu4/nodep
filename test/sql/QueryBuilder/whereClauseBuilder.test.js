'use strict';

const whereClauseBuilder = require('../../../lib/sql/QueryBuilder/whereClauseBuilder');

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
      const res = whereClauseBuilder(given);

      expect(res.clause).toEqual(expectedClause);
      expect(res.args).toEqual(expectedArgs);
    }
  );

  it('mind the offset', () => {
    const res = whereClauseBuilder({ age: '>10', id: 2 }, 1);

    expect(res.clause).toEqual(' WHERE "age" > $2 AND "id" = $3');
    expect(res.args).toEqual(['10', 2]);
  });
});

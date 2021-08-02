'use strict';

// @ts-check
const selectClauseBuilder = require('./selectClauseBuilder');
const { valueNum } = require('./shared');
const updateClauseBuilder = require('./updateClauseBuilder');
const whereClauseBuilder = require('./whereClauseBuilder');

module.exports = {
  insert({ tableName, record }) {
    const keysString = '"' + Object.keys(record).join('", "') + '"';

    const valueNumsString = Object.values(record)
      .map((_, index) => valueNum(index))
      .join(', ');

    const args = Object.values(record);
    const sql = `INSERT INTO "${tableName}" (${keysString}) VALUES (${valueNumsString})`;

    return { sql, args };
  },

  delete({ tableName, where }) {
    const { clause, args } = whereClauseBuilder(where);

    const sql = `DELETE FROM "${tableName}" ${clause}`;

    return { sql, args };
  },

  update({ tableName, delta, where }) {
    const { clause: updateClause, args: updateArgs } = updateClauseBuilder({
      delta,
      tableName,
    });

    const whereArgOffset = updateArgs.length;
    const { clause: whereClause, args: whereArgs } = whereClauseBuilder(
      where,
      whereArgOffset
    );

    const sql = updateClause + whereClause;
    const args = [...updateArgs, ...whereArgs];

    return { sql, args };
  },

  select({ tableName, where, fields = ['*'] }) {
    const { clause: selectClause } = selectClauseBuilder({
      tableName,
      fields,
    });

    const { clause: whereClause, args } = whereClauseBuilder(where);

    const sql = selectClause + whereClause;

    return { sql, args };
  },
};

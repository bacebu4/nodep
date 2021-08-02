'use strict';

// @ts-check
const selectClauseBuilder = require('./selectClauseBuilder');
const updateClauseBuilder = require('./updateClauseBuilder');
const whereClauseBuilder = require('./whereClauseBuilder');
const insertClauseBuilder = require('./insertClauseBuilder');

module.exports = {
  insert({ tableName, record }) {
    const { clause, args } = insertClauseBuilder({ tableName, record });

    return { sql: clause, args };
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

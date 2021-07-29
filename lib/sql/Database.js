'use strict';

// @ts-check
const { Pool, DatabaseError: PgDatabaseError } = require('pg');
const { DatabaseError } = require('./DatabaseError');
const { SelectQueryBuilder } = require('./SelectQueryBuilder');
const { valueNum } = require('./shared');
const { UpdatesClauseBuilder } = require('./UpdatesClauseBuilder');
const { WhereClauseBuilder } = require('./WhereClauseBuilder');

class Database {
  constructor(config) {
    this.pool = new Pool(config);
  }

  async query(sql, values, tableName) {
    try {
      const res = await this.pool.query(sql, values);
      return [null, res];
    } catch (error) {
      return [this.handleError({ error, tableName }), null];
    }
  }

  insert(tableName, record) {
    const keysString = '"' + Object.keys(record).join('", "') + '"';

    const valueNumsString = Object.values(record)
      .map((_, index) => valueNum(index))
      .join(', ');

    const values = Object.values(record);

    return this.query(
      `INSERT INTO "${tableName}" (${keysString}) VALUES (${valueNumsString})`,
      values,
      tableName
    );
  }

  delete(tableName, conditions) {
    const { clause, args } = new WhereClauseBuilder(conditions);
    return this.query(`DELETE FROM "${tableName}" ${clause}`, args, tableName);
  }

  update(tableName, delta, conditions) {
    const updateClause = new UpdatesClauseBuilder(delta);

    const whereArgOffset = updateClause.args.length;
    const whereClause = new WhereClauseBuilder(conditions, whereArgOffset);

    return this.query(
      `UPDATE "${tableName}" ${updateClause.clause} ${whereClause.clause}`,
      [...updateClause.args, ...whereClause.args],
      tableName
    );
  }

  select(tableName, conditions, options, fields = ['*']) {
    const { sql, args } = new SelectQueryBuilder({
      tableName,
      fields,
      conditions,
      options,
    });

    return this.query(sql, args, tableName);
  }

  async findOne(tableName, conditions, options, fields = ['*']) {
    const [error, res] = await this.select(
      tableName,
      conditions,
      options,
      fields
    );

    // don't i wanna throw?
    if (error) {
      return [error, null];
    }

    if (!res.rows.length) {
      return [
        new DatabaseError({
          message: 'Not found',
          table: tableName,
          detail: `Nothing was found with following conditions ${JSON.stringify(
            conditions
          )}`,
        }),
        null,
      ];
    }

    return [null, res.rows[0]];
  }

  async findAll(tableName, conditions, options, fields = ['*']) {
    const [error, res] = await this.select(
      tableName,
      conditions,
      options,
      fields
    );

    if (error) {
      return [error, null];
    }

    return [null, res.rows];
  }

  handleError({ error, tableName }) {
    if (error instanceof PgDatabaseError) {
      return new DatabaseError({
        message: error.message,
        detail: error.detail,
        table: error.table,
      });
    }

    if (error instanceof Error) {
      return new DatabaseError({
        message: error.message,
        detail: 'Unexpected error occurred ',
        table: tableName,
      });
    }

    return new DatabaseError({
      message: 'Unexpected error occurred',
      detail: 'Non error instance was trowed',
      table: tableName,
    });
  }

  close() {
    this.pool.end();
  }
}

module.exports = { Database };

'use strict';

const { WhereClauseBuilder } = require('./WhereClauseBuilder');

class SelectQueryBuilder {
  constructor({ tableName, fields, conditions }) {
    this.fields = fields;
    this.args = [];

    this.sqlStrings = [`SELECT ${this.fieldsToString()} FROM ${tableName}`];

    if (conditions) {
      const whereClause = new WhereClauseBuilder(conditions);
      this.sqlStrings.push(whereClause.clause);
      this.args.push(...whereClause.args);
    }

    this.sql = this.sqlStrings.join(' ');
  }

  fieldsToString() {
    return this.fields[0] === '*' ? '*' : `"${this.fields.join('", "')}"`;
  }
}

module.exports = { SelectQueryBuilder };

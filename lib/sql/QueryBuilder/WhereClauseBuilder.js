'use strict';

const { prop } = require('../../fp');
const { valueNum } = require('./shared');

class WhereClauseBuilder {
  constructor(conditions, argIndexOffset = 0) {
    if (!conditions) {
      this.clause = '';
      this.args = [];
      return;
    }

    const clausesWithArguments = Object.entries(conditions).map(
      ([key, value], index) => {
        const { arg, operator } = this.selectOperatorAndArgument(value);
        const clause = `"${key}" ${operator} ${valueNum(
          index,
          argIndexOffset
        )}`;
        return { clause, arg };
      }
    );

    const clauses = clausesWithArguments.map(prop('clause')).join(' AND ');
    const args = clausesWithArguments.map(prop('arg'));

    this.clause = ' WHERE ' + clauses;
    this.args = args;
  }

  selectOperatorAndArgument(value) {
    if (typeof value !== 'string') {
      return { operator: '=', arg: value };
    }

    const operator = this.findOperator(value);
    if (operator) {
      return { operator, arg: value.substring(operator.length) };
    }

    if (value.includes('*') || value.includes('?')) {
      const arg = value.replace(/\*/g, '%').replace(/\?/g, '_');
      return { operator: 'LIKE', arg };
    }

    return { operator: '=', arg: value };
  }

  findOperator(value) {
    const operators = ['>=', '<=', '<>', '>', '<'];
    return operators.find((op) => value.startsWith(op));
  }
}

module.exports = { WhereClauseBuilder };

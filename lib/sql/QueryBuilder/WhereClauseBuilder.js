'use strict';

const { prop } = require('../../fp');
const { valueNum } = require('./shared');

function findOperator(value) {
  const operators = ['>=', '<=', '<>', '>', '<'];
  return operators.find((op) => value.startsWith(op));
}

function selectOperatorAndArgument(value) {
  if (typeof value !== 'string') {
    return { operator: '=', arg: value };
  }

  const operator = findOperator(value);
  if (operator) {
    return { operator, arg: value.substring(operator.length) };
  }

  if (value.includes('*') || value.includes('?')) {
    const arg = value.replace(/\*/g, '%').replace(/\?/g, '_');
    return { operator: 'LIKE', arg };
  }

  return { operator: '=', arg: value };
}

module.exports = (conditions, argIndexOffset = 0) => {
  if (!conditions) {
    return { clause: '', args: [] };
  }

  const clausesWithArguments = Object.entries(conditions).map(
    ([key, value], index) => {
      const { arg, operator } = selectOperatorAndArgument(value);
      const clause = `"${key}" ${operator} ${valueNum(index, argIndexOffset)}`;
      return { clause, arg };
    }
  );

  const clause =
    ' WHERE ' + clausesWithArguments.map(prop('clause')).join(' AND ');
  const args = clausesWithArguments.map(prop('arg'));

  return { clause, args };
};

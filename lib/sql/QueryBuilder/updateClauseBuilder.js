'use strict';

const { prop } = require('../../fp');
const { valueNum } = require('./shared');

module.exports = ({ delta, tableName, argIndexOffset = 0 }) => {
  const clausesWithArguments = Object.entries(delta).map(
    ([key, value], index) => ({
      clause: `"${key}" = ${valueNum(index, argIndexOffset)}`,
      arg: value,
    })
  );

  const clause =
    `UPDATE "${tableName}" SET ` +
    clausesWithArguments.map(prop('clause')).join(', ');
  const args = clausesWithArguments.map(prop('arg'));

  return { clause, args };
};

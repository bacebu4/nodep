'use strict';

const { valueNum } = require('./shared');

module.exports = ({ tableName, record }) => {
  const keysString = '"' + Object.keys(record).join('", "') + '"';

  const valueNumsString = Object.values(record)
    .map((_, index) => valueNum(index))
    .join(', ');

  const args = Object.values(record);
  const clause = `INSERT INTO "${tableName}" (${keysString}) VALUES (${valueNumsString})`;

  return { clause, args };
};

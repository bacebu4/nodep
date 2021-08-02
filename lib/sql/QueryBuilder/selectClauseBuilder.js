'use strict';

const fieldsToString = (fields) => {
  if (fields[0] === '*') {
    return '*';
  }

  return `"${fields.join('", "')}"`;
};

module.exports = ({ tableName, fields }) => {
  const clause = `SELECT ${fieldsToString(fields)} FROM ${tableName}`;

  return { clause };
};

'use strict';

const { first } = require('../../fp');

const fieldsToString = (fields) => {
  if (first(fields) === '*') {
    return '*';
  }

  return `"${fields.join('", "')}"`;
};

module.exports = ({ tableName, fields = ['*'] }) => {
  const clause = `SELECT ${fieldsToString(fields)} FROM ${tableName}`;

  return { clause };
};

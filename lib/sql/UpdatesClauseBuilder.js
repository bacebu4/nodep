'use strict';

const { prop } = require('../fp');
const { valueNum } = require('./shared');

// TODO update query builder
class UpdatesClauseBuilder {
  constructor(delta, argIndexOffset = 0) {
    const clausesWithArguments = Object.entries(delta).map(
      ([key, value], index) => ({
        clause: `"${key}" = ${valueNum(index, argIndexOffset)}`,
        arg: value,
      })
    );

    this.clause = 'SET ' + clausesWithArguments.map(prop('clause')).join(', ');
    this.args = clausesWithArguments.map(prop('arg'));
  }
}

module.exports = { UpdatesClauseBuilder };

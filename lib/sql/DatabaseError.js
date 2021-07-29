'use strict';

class DatabaseError extends Error {
  constructor({ message, table, detail }) {
    super(message);
    this.table = table;
    this.detail = detail;

    this.removeUselessStackTraces();
  }

  removeUselessStackTraces() {
    this.stack = this.stack
      .split('\n')
      .filter(
        (line) =>
          !line.includes('at handleRequestFailure') &&
          !line.includes('at Database.handleError') &&
          !line.includes('at processTicksAndRejections')
      )
      .join('\n');
  }
}

module.exports = { DatabaseError };

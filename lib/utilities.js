'use strict';

const safe =
  (fn) =>
  (...args) => {
    try {
      return [null, fn(...args)];
    } catch (err) {
      return [err, null];
    }
  };

module.exports = { safe };

'use strict';

const { URL } = require('./URL');

class GivenURL extends URL {
  constructor(url) {
    super(url);
  }

  forEachParam(callback) {
    this.splittedUrl
      .map((suburl, index) => ({ name: suburl, index }))
      .filter(({ name }) => name.startsWith(':'))
      .forEach(({ name, index }, _, array) =>
        callback(name.slice(1), index, array)
      );
  }
}

module.exports = { GivenURL };

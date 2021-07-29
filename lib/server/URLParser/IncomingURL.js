'use strict';

const { URL } = require('./URL');

class IncomingURL extends URL {
  constructor(url) {
    super(url);
    this.query = {};
    this.raw = url;

    if (this.url.includes('?')) {
      this.url = url.slice(0, url.indexOf('?'));
      this.splittedUrl = this.url.split('/');
      this.parseQuery();
    }
  }

  parseQuery() {
    const queryString = this.raw.slice(this.raw.indexOf('?') + 1);
    const queryEntries = new URLSearchParams(queryString).entries();
    this.query = Object.fromEntries(queryEntries);
  }
}

module.exports = { IncomingURL };

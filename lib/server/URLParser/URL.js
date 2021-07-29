'use strict';

const { SubURL } = require('./SubURL');

class URL {
  constructor(url) {
    let processedUrl = url;

    if (processedUrl.startsWith('/')) {
      processedUrl = processedUrl.slice(1);
    }

    this.url = processedUrl;
    this.splittedUrl = this.url.split('/');
  }

  subUrlAtPosition(index) {
    return new SubURL(this.splittedUrl[index]);
  }

  get amountOfSuburls() {
    return this.splittedUrl.length;
  }

  mapSubUrls(callback) {
    return this.splittedUrl.map((suburl) => new SubURL(suburl)).map(callback);
  }
}

module.exports = { URL };

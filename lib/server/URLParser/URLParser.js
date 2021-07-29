'use strict';

const { GivenURL } = require('./GiveURL');
const { IncomingURL } = require('./IncomingURL');
const { URL } = require('./URL');

class URLParser {
  constructor(rawIncomingUrl, rawGivenUrls) {
    this.rawGivenUrls = rawGivenUrls;

    this.incomingUrl = new IncomingURL(rawIncomingUrl);

    const rawMatchingUrl = this.matchWithGivenUrls();

    if (!rawMatchingUrl) {
      this.error = true;
      return;
    }

    this.parseParams(rawMatchingUrl);

    // return handler instead
    this.matchingUrl = rawMatchingUrl;
    this.query = this.incomingUrl.query;
  }

  static from(incomingUrl, givenUrls) {
    const { matchingUrl, params, query, error } = new URLParser(
      incomingUrl,
      givenUrls
    );

    if (error) {
      return [true, null];
    }

    return [null, { matchingUrl, params, query }];
  }

  matchWithGivenUrls() {
    return this.rawGivenUrls.find((rawGivenUrl) => {
      const givenUrl = new URL(rawGivenUrl);

      if (givenUrl.amountOfSuburls !== this.incomingUrl.amountOfSuburls) {
        return false;
      }

      const subUrlComparisonResults = givenUrl.mapSubUrls(
        (givenSubUrl, index) =>
          givenSubUrl.isMatchingWith(this.incomingUrl.subUrlAtPosition(index))
      );

      return subUrlComparisonResults.every(Boolean);
    });
  }

  parseParams(rawMatchingUrl) {
    this.params = {};
    const matchingUrl = new GivenURL(rawMatchingUrl);

    matchingUrl.forEachParam((paramName, index) => {
      const queryValue = this.incomingUrl.subUrlAtPosition(index).value;

      this.params[paramName] = queryValue;
    });
  }
}

module.exports = { URLParser };

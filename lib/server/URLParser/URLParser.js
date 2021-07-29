'use strict';

const { GivenURL } = require('./GiveURL');
const { IncomingURL } = require('./IncomingURL');
const { URL } = require('./URL');

class URLParser {
  constructor(rawIncomingUrl, givenUrls) {
    this.givenUrls = givenUrls;

    this.incomingUrl = new IncomingURL(rawIncomingUrl);

    const matchingUrl = this.matchWithGivenUrls();

    if (!matchingUrl) {
      this.error = true;
      return;
    }

    this.parseParams(matchingUrl);

    // return handler instead
    this.handler = matchingUrl.handle;
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
    return this.givenUrls.find(({ route }) => {
      const givenUrl = new URL(route);

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

  parseParams({ route }) {
    this.params = {};
    console.log('here');
    console.log(route);
    const matchingUrl = new GivenURL(route);

    matchingUrl.forEachParam((paramName, index) => {
      const queryValue = this.incomingUrl.subUrlAtPosition(index).value;

      this.params[paramName] = queryValue;
    });
  }
}

module.exports = { URLParser };

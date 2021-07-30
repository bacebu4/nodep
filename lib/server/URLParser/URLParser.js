'use strict';

const { GivenURL } = require('./GiveURL');
const { IncomingURL } = require('./IncomingURL');
const { URL } = require('./URL');

class URLParser {
  constructor(requestUrl, requestMethod, routes) {
    this.routes = routes;
    this.requestMethod = requestMethod;
    this.incomingUrl = new IncomingURL(requestUrl);

    const foundRoute = this.findRoute();

    if (!foundRoute) {
      this.error = true;
      return;
    }

    this.parseParams(foundRoute);

    this.handler = foundRoute.handle;
    this.query = this.incomingUrl.query;
  }

  static from(requestUrl, requestMethod, routes) {
    const { handler, params, query, error } = new URLParser(
      requestUrl,
      requestMethod,
      routes
    );

    if (error) {
      return [true, null];
    }

    return [null, { handler, params, query }];
  }

  findRoute() {
    return this.routes.find(({ path, method }) => {
      if (method !== this.requestMethod) {
        return false;
      }

      const routeUrl = new URL(path);

      if (routeUrl.amountOfSuburls !== this.incomingUrl.amountOfSuburls) {
        return false;
      }

      const subUrlComparisonResults = routeUrl.mapSubUrls(
        (givenSubUrl, index) =>
          givenSubUrl.isMatchingWith(this.incomingUrl.subUrlAtPosition(index))
      );

      return subUrlComparisonResults.every(Boolean);
    });
  }

  parseParams({ path }) {
    this.params = {};
    const matchingUrl = new GivenURL(path);

    matchingUrl.forEachParam((paramName, index) => {
      const queryValue = this.incomingUrl.subUrlAtPosition(index).value;

      this.params[paramName] = queryValue;
    });
  }
}

module.exports = { URLParser };

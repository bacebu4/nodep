'use strict';

const { RouteURL } = require('./RouteURL');
const { RequestURL } = require('./RequestURL');
const { URL } = require('./URL');

class URLParser {
  constructor(requestUrl, requestMethod, routes) {
    this.routes = routes;
    this.requestMethod = requestMethod;
    this.requestUrl = new RequestURL(requestUrl);

    const foundRoute = this.findRoute();

    if (!foundRoute) {
      this.error = true;
      return;
    }

    this.parseParams(foundRoute);

    this.handler = foundRoute.handle;
    this.query = this.requestUrl.query;
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

      if (routeUrl.amountOfSuburls !== this.requestUrl.amountOfSuburls) {
        return false;
      }

      const subUrlComparisonResults = routeUrl.mapSubUrls(
        (givenSubUrl, index) =>
          givenSubUrl.isMatchingWith(this.requestUrl.subUrlAtPosition(index))
      );

      return subUrlComparisonResults.every(Boolean);
    });
  }

  parseParams({ path }) {
    this.params = {};
    const foundRouteUrl = new RouteURL(path);

    foundRouteUrl.forEachParam((paramName, index) => {
      const paramValue = this.requestUrl.subUrlAtPosition(index).value;

      this.params[paramName] = paramValue;
    });
  }
}

module.exports = { URLParser };

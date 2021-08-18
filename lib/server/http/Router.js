'use strict';

class Router {
  constructor(prefix, routes) {
    if (prefix.startsWith('/')) {
      prefix = prefix.slice(1);
    }

    const rawRoutes = routes?.routes || routes;

    this.routes = rawRoutes.map((route) => ({
      ...route,
      path: prefix + '/' + route.path,
    }));
  }
}

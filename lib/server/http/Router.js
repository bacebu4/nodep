'use strict';

const addPrefixToPath = (prefix) => (route) => ({
  ...route,
  path: prefix + '/' + route.path,
});

module.exports = (prefix, ...args) => {
  if (prefix.startsWith('/')) {
    prefix = prefix.slice(1);
  }

  let routes = [];
  const addInputPrefixToPath = addPrefixToPath(prefix);

  args.forEach((arg) => {
    if (arg.routes) {
      routes.push(...arg.routes.map(addInputPrefixToPath));
    } else {
      routes.push(addInputPrefixToPath(arg));
    }
  });

  return routes;
};

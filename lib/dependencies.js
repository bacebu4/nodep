'use strict';

const node = {};
const internalsDeps = ['fs', 'vm', 'path'];

for (const depName of internalsDeps) {
  node[depName] = require(depName);
}

node.fsp = node.fs.promises;

Object.freeze(node);
module.exports = { node };

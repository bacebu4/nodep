'use strict';

const prop = (name) => (data) => data[name];

const first = (array) => array?.[0];

module.exports = { prop, first };

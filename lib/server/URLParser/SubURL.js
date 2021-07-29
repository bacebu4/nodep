'use strict';

class SubURL {
  constructor(value) {
    this.value = value;
  }

  isParam() {
    return this.value.startsWith(':');
  }

  equalsTo(anotherSubUrl) {
    return this.value === anotherSubUrl.value;
  }

  isMatchingWith(anotherSubUrl) {
    return this.value === anotherSubUrl.value || this.isParam();
  }
}

module.exports = { SubURL };

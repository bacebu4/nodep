'use strict';

class LockQueue {
  constructor() {
    this.queue = [];
    this.notLocked = true;
    this.cbQueue = [];
  }

  lock() {
    this.notLocked = false;
  }

  unlock() {
    for (const { cb, args } of this.cbQueue) {
      cb(...args);
    }

    this.notLocked = true;
  }

  push(...args) {
    if (this.notLocked) {
      this.queue.push(el);
    } else {
      this.cbQueue.push({ cb: this.queue.push.bind(this), args });
    }
  }

  unshift() {
    if (this.notLocked) {
      return this.queue.unshift();
    } else {
      this.cbQueue.push({ cb: this.queue.unshift.bind(this), args: [] });
    }
  }
}

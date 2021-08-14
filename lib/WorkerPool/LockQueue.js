'use strict';

const { Semaphore } = require('../Semaphore/Semaphore');

class LockQueue {
  constructor() {
    this.queue = [];
    this.semaphore = new Semaphore();
  }

  push(el) {
    this.queue.push(el);
  }

  shift() {
    return new Promise((resolve) => {
      this.semaphore.enter();
      const el = this.queue.shift();
      resolve(el);
      this.semaphore.leave();
    });
  }

  deleteById(id) {
    return new Promise((resolve) => {
      this.semaphore.enter();

      const indexToDelete = this.queue.findIndex(
        (queueItem) => queueItem.id === id
      );
      const [queueItem] = this.queue.splice(indexToDelete, 1);
      resolve(queueItem);

      this.semaphore.leave();
    });
  }
}

module.exports = { LockQueue };

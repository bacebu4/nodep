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
    this.semaphore.enter();
    const el = this.queue.shift();
    this.semaphore.leave();
    return el;
  }

  deleteById(id) {
    this.semaphore.enter();

    const indexToDelete = this.queue.findIndex(
      (queueItem) => queueItem.id === id
    );
    const [queueItem] = this.queue.splice(indexToDelete, 1);

    this.semaphore.leave();

    return queueItem;
  }
}

module.exports = { LockQueue };

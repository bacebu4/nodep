'use strict';

const LOCKED = 0;
const UNLOCKED = 1;

class LockQueue {
  constructor() {
    this.queue = [];

    const buffer = new SharedArrayBuffer(4);
    this.lock = new Int32Array(buffer, 0, 1);
    Atomics.store(this.lock, 0, UNLOCKED);
  }

  enter() {
    let prev = Atomics.exchange(this.lock, 0, LOCKED);
    while (prev !== UNLOCKED) {
      Atomics.wait(this.lock, 0, LOCKED);
      prev = Atomics.exchange(this.lock, 0, LOCKED);
    }
  }

  leave() {
    if (Atomics.load(this.lock, 0) === UNLOCKED) {
      throw new Error('Cannot leave unlocked BinarySemaphore');
    }
    Atomics.store(this.lock, 0, UNLOCKED);
    Atomics.notify(this.lock, 0, 1);
  }

  push(el) {
    this.queue.push(el);
  }

  shift() {
    return new Promise((resolve) => {
      this.enter();
      const el = this.queue.shift();
      resolve(el);
      this.leave();
    });
  }

  deleteById(id) {
    return new Promise((resolve) => {
      this.enter();

      const indexToDelete = this.queue.findIndex(
        (queueItem) => queueItem.id === id
      );
      const [queueItem] = this.queue.splice(indexToDelete, 1);
      resolve(queueItem);

      this.leave();
    });
  }
}

module.exports = { LockQueue };

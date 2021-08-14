'use strict';

const path = require('path');
const { v4: uuid } = require('uuid');
const { Worker } = require('worker_threads');
const { LockQueue } = require('./LockQueue');

const WORKER_NAME = 'worker.js';

class WorkerPool {
  constructor(modulePath, numberOfThreads, timeout) {
    this.modulePath = modulePath;
    this.timeout = timeout;
    this.queue = new LockQueue();
    this.pool = [];

    const workerPath = path.join(__dirname, WORKER_NAME);

    for (let id = 0; id < numberOfThreads; ++id) {
      this.pool.push(
        new Worker(workerPath, {
          workerData: { id, modulePath: this.modulePath },
        })
      );
    }
  }

  run(...args) {
    return new Promise(async (resolve, reject) => {
      const worker = this.pool.pop();

      if (!worker) {
        const id = uuid();
        const timeoutRef = this.scheduleTimeoutById(id);
        this.queue.push({ args, resolve, reject, id, timeoutRef });
        return;
      }

      try {
        const data = await this.runInWorker(args, worker);
        resolve(data);
      } catch (error) {
        reject(error);
      }
    });
  }

  runInWorker(args, worker) {
    return new Promise((resolve, reject) => {
      worker.postMessage({ args });

      worker.on('message', (data) => {
        resolve(data);
        this.cleanupWorkerAndRunPending(worker);
      });

      worker.on('error', (error) => {
        reject(error);
        this.cleanupWorkerAndRunPending(worker);
      });

      worker.on('exit', (code) => {
        if (code !== 0) {
          reject(new Error(`Worker stopped with exit code ${code}`));
          this.cleanupWorkerAndRunPending(worker);
        }
      });
    });
  }

  async cleanupWorkerAndRunPending(worker) {
    worker.removeAllListeners('error');
    worker.removeAllListeners('message');
    worker.removeAllListeners('exit');

    const { args, resolve, reject, timeoutRef } = this.queue.shift() || {};

    if (!args) {
      this.pool.push(worker);
      return;
    }

    try {
      clearTimeout(timeoutRef);
      const data = await this.runInWorker(args, worker);
      resolve(data);
    } catch (error) {
      reject(error);
    }
  }

  scheduleTimeoutById(id) {
    return setTimeout(() => {
      const { reject } = this.queue.deleteById(id);

      reject(new Error('Timeout'));
    }, this.timeout);
  }
}

module.exports = WorkerPool;

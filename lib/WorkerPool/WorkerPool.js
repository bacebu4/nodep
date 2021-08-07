'use strict';

const path = require('path');
const { Worker } = require('worker_threads');

class WorkerPool {
  constructor(modulePath, numberOfThreads, timeout) {
    this.modulePath = modulePath;
    this.timeout = timeout;
    this.queue = [];
    this.pool = [];

    const workerPath = path.join(__dirname, 'worker.js');

    for (let number = 0; number < numberOfThreads; ++number) {
      this.pool.push({
        worker: new Worker(workerPath, {
          workerData: { number, modulePath: this.modulePath },
        }),
        active: false,
      });
    }
  }

  run(...args) {
    return new Promise((resolve, reject) => {
      const worker = this.getInactiveWorker();

      if (!worker) {
        this.queue.push(args);
        reject(new Error('Not supported yet!'));
      }

      worker.postMessage({ args });

      worker.on('message', resolve);

      worker.on('error', reject);

      worker.on('exit', (code) => {
        if (code !== 0) {
          reject(new Error(`Worker stopped with exit code ${code}`));
        }
      });
    });
  }

  getInactiveWorker() {
    return this.pool.find(({ active }) => !active).worker;
  }
}

module.exports = WorkerPool;

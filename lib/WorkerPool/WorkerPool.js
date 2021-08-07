'use strict';

const path = require('path');
const { Worker } = require('worker_threads');

const WORKER_NAME = 'worker.js';

class WorkerPool {
  constructor(modulePath, numberOfThreads, timeout) {
    this.modulePath = modulePath;
    this.timeout = timeout;
    this.queue = [];
    this.pool = [];

    const workerPath = path.join(__dirname, WORKER_NAME);

    for (let number = 0; number < numberOfThreads; ++number) {
      this.pool.push({
        worker: new Worker(workerPath, {
          workerData: { number, modulePath: this.modulePath },
        }),
        active: false,
        id: number,
      });
    }
  }

  run(...args) {
    return new Promise((resolve, reject) => {
      const workerRecord = this.getInactiveWorker();

      if (!workerRecord) {
        this.queue.push({ args, resolve, reject });
        return;
      }

      workerRecord.active = true;
      workerRecord.worker.postMessage({ args });

      workerRecord.worker.on('message', (data) => {
        resolve(data);
        this.cleanupWorkerById(workerRecord.id);
        this.runPendingTasks();
      });

      workerRecord.worker.on('error', (error) => {
        reject(error);
        this.cleanupWorkerById(workerRecord.id);
        this.runPendingTasks();
      });

      workerRecord.worker.on('exit', (code) => {
        if (code !== 0) {
          reject(new Error(`Worker stopped with exit code ${code}`));
          this.cleanupWorkerById(workerRecord.id);
          this.runPendingTasks();
        }
      });
    });
  }

  getInactiveWorker() {
    return this.pool.find(({ active }) => !active);
  }

  cleanupWorkerById(id) {
    const workerRecord = this.pool.find((w) => w.id === id);
    workerRecord.active = false;
    workerRecord.worker.removeAllListeners('error');
    workerRecord.worker.removeAllListeners('message');
    workerRecord.worker.removeAllListeners('exit');
  }

  async runPendingTasks() {
    const { args, resolve, reject } = this.queue.shift() || {};

    if (!args) {
      return;
    }

    try {
      const data = await this.run(...args);
      resolve(data);
    } catch (error) {
      reject(error);
    }
  }
}

module.exports = WorkerPool;

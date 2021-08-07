'use strict';

// const Config = require('./lib/config');
const server = require('./lib/server/http');
const WorkerPool = require('./lib/WorkerPool/WorkerPool');
const path = require('path');

// @ts-check

(async () => {
  // const config = await new Config('./src/config');

  const routes = [
    {
      path: 'id/:key/update',
      handle() {
        console.log('hello1');
      },
      method: 'GET',
    },
    {
      path: 'id/:key/delete',
      handle() {
        console.log('hello2');
      },
      method: 'GET',
    },
    {
      path: 'users/get',
      handle() {
        console.log('hello3');
      },
      method: 'GET',
    },
    {
      path: 'users/get/:id',
      handle() {
        console.log('hello4');
      },
      method: 'POST',
    },
  ];

  server(routes).start();
  const taskPath = path.join(__dirname, 'longOperation.js');
  const workerPool = new WorkerPool(taskPath, 3, 3000);
  workerPool.run('vas', 22, 'male');
})();

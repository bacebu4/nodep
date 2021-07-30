'use strict';

// const Config = require('./lib/config');
// const { Database } = require('./lib/sql/Database');
const server = require('./lib/server/Server/Server');

// @ts-check

(async () => {
  // const config = await new Config('./src/config');

  // const db = new Database(config.db);
  // const res = await db.insert('users', { id: 4, name: 'vas', age: 12 });
  // console.log({ res });
  // db.delete('users', { name: '>vas', age: 3 });
  // db.update('users', { age: 3, name: 'vas3' }, { name: 'vas', age: '<3' });
  // const res = await db.findAll('users', { name: 'vasya' });
  // console.log(res[1]);

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
})();

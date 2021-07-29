'use strict';

const Config = require('./lib/config');
const { Database } = require('./lib/sql/Database');
const { URLParser } = require('./lib/server/URLParser');
const { Server } = require('./lib/server/Server/Server');

// @ts-check

(async () => {
  const config = await new Config('./src/config');

  const db = new Database(config.db);
  // const res = await db.insert('users', { id: 4, name: 'vas', age: 12 });
  // console.log({ res });
  // db.delete('users', { name: '>vas', age: 3 });
  // db.update('users', { age: 3, name: 'vas3' }, { name: 'vas', age: '<3' });
  const res = await db.findAll('users', { name: 'vasya' });
  console.log(res[1]);

  const givenUrls = [
    {
      route: 'id/:key/update',
      handle() {
        console.log('hello1');
      },
    },
    {
      route: 'id/:key/delete',
      handle() {
        console.log('hello2');
      },
    },
    {
      route: 'users/get',
      handle() {
        console.log('hello3');
      },
    },
    {
      route: 'users/get/:id',
      handle() {
        console.log('hello4');
      },
    },
  ];

  // const rawIncomingUrl = 'id/124/update';
  // const rawIncomingUrl = 'users/get';
  const rawIncomingUrl = 'users/get/23?apiKey=123&key=avx';

  const { handler, params, query } = new URLParser(rawIncomingUrl, givenUrls);
  console.log({ handler, params, query });

  new Server().start();
})();

'use strict';

const Config = require('./lib/config');
const { Database } = require('./lib/sql/Database');
const { URLParser } = require('./lib/server/URLParser');
const { Server } = require('./lib/server/Server/Server');

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
    'id/:key/update',
    'id/:key/delete',
    'users/get',
    'users/get/:id',
  ];

  // const rawIncomingUrl = 'id/124/update';
  // const rawIncomingUrl = 'users/get';
  const rawIncomingUrl = 'users/get/23?apiKey=123&key=avx';

  const { matchingUrl, params, query } = new URLParser(
    rawIncomingUrl,
    givenUrls
  );
  console.log({ matchingUrl, params, query });

  new Server().start();
})();

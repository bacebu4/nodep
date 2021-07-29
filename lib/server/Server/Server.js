'use strict';

const http = require('http');
const { receiveBody } = require('../bodyParser');

class Server {
  constructor(routes) {
    this.routes = routes;
    this.server = http.createServer(async (req, res) => {
      const { method, url, socket } = req;

      let body = {};
      if (method !== 'GET') {
        body = await receiveBody(req);
      }

      console.log(`${method}\t${url}\t${socket.remoteAddress}`);
      console.log(body);
      res.write('hey');
      res.end();
    });
  }

  start() {
    this.server.listen(3000);
  }
}

module.exports = { Server };

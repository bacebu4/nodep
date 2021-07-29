'use strict';

const http = require('http');
const { receiveBody } = require('../bodyParser');

class Server {
  constructor(routes) {
    this.routes = routes;
    this.server = http.createServer(async (req, res) => {
      const { method, url, socket } = req;

      const body = await receiveBody(req);

      console.log(`${method}\t${url}\t${socket.remoteAddress}`);
      console.log(body);

      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ bar: 'foo' }));
    });
  }

  start() {
    this.server.listen(3000);
  }
}

module.exports = { Server };

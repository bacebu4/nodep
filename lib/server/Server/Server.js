'use strict';

const http = require('http');
const { receiveBody } = require('../bodyParser');
const { URLParser } = require('../URLParser');

class Server {
  constructor(routes) {
    this.routes = routes;
    this.server = http.createServer(async (req, res) => {
      const { method, url, socket } = req;

      const body = await receiveBody(req);
      const [error, parsedUrl] = URLParser.from({
        requestUrl: url,
        requestMethod: method,
        routes: this.routes,
      });

      if (error) {
        res.statusCode = 404;
        res.end('Not found');
        return;
      }

      const { handler, params, query } = parsedUrl;
      console.log(`${method}\t${url}\t${socket.remoteAddress}`);
      console.log({ body, handler, params, query });

      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ bar: 'foo' }));
    });
  }

  start() {
    this.server.listen(3000);
  }
}

module.exports = { Server };

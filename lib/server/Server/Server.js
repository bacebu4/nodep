'use strict';

const http = require('http');
const { receiveBody } = require('../bodyParser');
const { URLParser } = require('../URLParser');
const { ResponseController } = require('./ResponseController');

class Server {
  constructor(routes) {
    this.routes = routes;
    this.server = http.createServer(async (req, res) => {
      const resController = new ResponseController(res);

      const {
        method,
        url,
        socket: { remoteAddress = 'unknown' },
      } = req;

      console.log(`${method}\t${url}\t${remoteAddress}`);

      const [error, parsedUrl] = URLParser.from({
        requestUrl: url,
        requestMethod: method,
        routes: this.routes,
      });

      if (error) {
        resController.sendMessage({
          message: 'Not found URL',
          statusCode: 404,
        });
        return;
      }

      const body = await receiveBody(req);

      const { handler, params, query } = parsedUrl;

      const { data = {}, statusCode = 500 } =
        handler({ body, params, query }) || {};

      resController.sendData({ data, statusCode });
    });
  }

  start() {
    this.server.listen(3000);
  }
}

module.exports = { Server };

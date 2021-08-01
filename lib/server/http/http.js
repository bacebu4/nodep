'use strict';

const http = require('http');
const { receiveBody } = require('../bodyParser');
const { URLParser } = require('../URLParser');
const { ResponseController } = require('./ResponseController');

module.exports = (routes) => {
  const server = http.createServer(async (req, res) => {
    const resController = new ResponseController(res);
    try {
      const {
        method,
        url,
        socket: { remoteAddress = 'unknown' },
      } = req;

      console.log(`${method}\t${url}\t${remoteAddress}`);

      const [error, parsedUrl] = URLParser.from({
        requestUrl: url,
        requestMethod: method,
        routes,
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

      const { data = {}, statusCode = 200 } =
        handler({ body, params, query }) || {};

      resController.sendData({ data, statusCode });
    } catch (error) {
      resController.sendMessage({
        message: 'Internal server error',
        statusCode: 500,
      });
    }
  });

  return {
    start() {
      server.listen(3000);
    },
  };
};

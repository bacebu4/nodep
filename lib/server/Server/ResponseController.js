'use strict';

class ResponseController {
  constructor(res) {
    this.res = res;
  }

  sendMessage({ message, statusCode }) {
    this.res.statusCode = statusCode;
    this.res.setHeader('Content-Type', 'application/json');
    this.res.end(JSON.stringify({ message }));
  }

  sendData({ data, statusCode }) {
    this.res.statusCode = statusCode;
    this.res.setHeader('Content-Type', 'application/json');
    this.res.end(JSON.stringify(data));
  }
}

module.exports = { ResponseController };

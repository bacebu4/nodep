'use strict';

const receiveBody = async (req) => {
  if (req.method === 'GET') {
    return {};
  }

  const buffers = [];
  for await (const chunk of req) buffers.push(chunk);
  const data = Buffer.concat(buffers).toString();
  return JSON.parse(data);
};

module.exports = { receiveBody };

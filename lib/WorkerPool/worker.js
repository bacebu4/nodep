const { parentPort, workerData } = require('worker_threads');

const task = require(workerData.modulePath);

parentPort.on('message', (payload) => {
  const { args } = payload;

  parentPort.postMessage({
    message: `Completed at worker ${workerData.id} with ${args}`,
  });
});

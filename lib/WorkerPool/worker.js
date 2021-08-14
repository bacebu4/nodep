const { parentPort, workerData } = require('worker_threads');

console.log(`worker #${workerData.id} has been started`);

const task = require(workerData.modulePath);

parentPort.on('message', (payload) => {
  const { args } = payload;
  console.log(`received args at worker #${workerData.id}: `, args);
  parentPort.postMessage({
    message: `Completed at worker ${workerData.id} with ${args}`,
  });
});

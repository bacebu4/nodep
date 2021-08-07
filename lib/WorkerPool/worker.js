const { parentPort, workerData } = require('worker_threads');

console.log(`worker #${workerData.number} has been started`);

const task = require(workerData.modulePath);

parentPort.on('message', (payload) => {
  const { args } = payload;
  console.log(`received args at worker #${workerData.number}: `, args);
  parentPort.postMessage({});
});

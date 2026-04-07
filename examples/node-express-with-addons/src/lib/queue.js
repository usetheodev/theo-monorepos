const { Queue, Worker } = require("bullmq");

const connection = {
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379", 10),
};

const defaultQueue = new Queue("default", { connection });

function createWorker(name, processor) {
  return new Worker(name, processor, { connection });
}

module.exports = { defaultQueue, createWorker, connection };

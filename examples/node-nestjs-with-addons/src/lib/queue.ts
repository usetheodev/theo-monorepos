import { Queue, Worker, type Processor } from "bullmq";

const connection = {
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379", 10),
};

export const defaultQueue = new Queue("default", { connection });

export function createWorker(name: string, processor: Processor) {
  return new Worker(name, processor, { connection });
}

export { connection };

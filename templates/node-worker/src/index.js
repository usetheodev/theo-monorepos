const express = require("express");

const app = express();
const port = process.env.PORT || 3000;

// --- Health endpoint for Kubernetes probes ---

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(port, () => {
  console.log(`Health server running on port ${port}`);
});

// --- Worker loop ---

const POLL_INTERVAL_MS = parseInt(process.env.POLL_INTERVAL_MS || "5000", 10);

async function processJob() {
  // Replace this with your actual job logic:
  // - poll a queue (SQS, Redis, RabbitMQ)
  // - process pending database records
  // - run a scheduled task
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Processing job...`);
}

async function runWorker() {
  console.log(`Worker started — polling every ${POLL_INTERVAL_MS}ms`);

  while (true) {
    try {
      await processJob();
    } catch (err) {
      console.error("Job processing failed:", err);
    }

    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
  }
}

runWorker();

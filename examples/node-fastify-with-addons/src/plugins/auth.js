const fp = require("fastify-plugin");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "change-me-in-production";

module.exports = fp(async function authPlugin(fastify) {
  fastify.decorate("authenticate", async function (request, reply) {
    const token = request.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      reply.code(401).send({ error: "Unauthorized" });
      return;
    }
    try {
      request.user = jwt.verify(token, JWT_SECRET);
    } catch {
      reply.code(401).send({ error: "Invalid token" });
    }
  });

  fastify.decorate("generateToken", function (payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
  });
});

const { PrismaClient } = require("@prisma/client");
const logger = require("./logger");

const prisma = new PrismaClient();

// Ensure connection
prisma.$connect()
  .then(() => logger.info("Connected to PostgreSQL"))
  .catch((err) => logger.error("Failed to connect to PostgreSQL", { error: err.message }));

module.exports = prisma;

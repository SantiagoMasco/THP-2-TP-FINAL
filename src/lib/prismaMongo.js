const { PrismaClient } = require("../generated/mongo/index.js");

const prismaMongo = new PrismaClient({
  log: ["error", "warn"]
});

module.exports = prismaMongo;

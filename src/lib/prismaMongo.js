import { PrismaClient } from "../generated/mongo/index.js";

const prismaMongo = new PrismaClient({
  log: ["error", "warn"]
});

export default prismaMongo;

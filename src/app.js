const express = require("express");
const ping = require("./routes/ping.routes");
const health = require("./routes/health.routes");

const app = express();
app.use(express.json());

app.use("/ping", ping);
app.use("/health", health);

module.exports = app;

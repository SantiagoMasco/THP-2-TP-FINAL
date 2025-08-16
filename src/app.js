const express = require("express");
const ping = require("./routes/ping.routes");
const health = require("./routes/health.routes");
const users = require("./routes/users.routes");
const tickets = require("./routes/tickets.routes");

const app = express();
app.use(express.json());

app.use("/ping", ping);
app.use("/health", health);
app.use("/users", users);
app.use("/tickets", tickets);

module.exports = app;

const express = require("express");
const cors = require("cors");
const ping = require("./routes/ping.routes");
const health = require("./routes/health.routes");
const users = require("./routes/users.routes");
const tickets = require("./routes/tickets.routes");
const stats = require("./routes/stats.routes");

const app = express();

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000'];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS policy'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/ping", ping);
app.use("/health", health);
app.use("/users", users);
app.use("/tickets", tickets);
app.use("/stats", stats);

module.exports = app;

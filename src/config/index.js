const fs = require("fs");
const path = require("path");
const { parse } = require("yaml");

const DEFAULTS = {
  port: 3000,
  db: { sqlite_path: "./data/app.sqlite" },
  pagination: { defaultPageSize: 20, maxPageSize: 100 },
  features: { stats: true },
};

let cached = null;

function getConfig() {
  if (cached) return cached;
  const file = path.resolve("config", "config.yaml");
  let fromYaml = {};
  if (fs.existsSync(file)) {
    const raw = fs.readFileSync(file, "utf8");
    fromYaml = parse(raw) || {};
  }
  cached = { ...DEFAULTS, ...fromYaml };
  return cached;
}

module.exports = { getConfig };

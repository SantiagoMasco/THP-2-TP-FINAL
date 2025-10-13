const { Router } = require("express");

const router = Router();
const startedAt = Date.now();

router.get("/", (req, res) => {
  const uptime = Math.round((Date.now() - startedAt) / 1000);
  res.json({ ok: true, uptime });
});

router.get("/mongo", async (req, res) => {
  try {
    const prismaMongo = require("../lib/prismaMongo");
    await prismaMongo.$runCommandRaw({ ping: 1 });
    res.status(200).json({ ok: true, mongo: "up" });
  } catch (err) {
    res.status(500).json({ ok: false, error: err?.message || "Mongo ping failed" });
  }
});

module.exports = router;

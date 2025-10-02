const { Router } = require("express");

const router = Router();
const startedAt = Date.now();

router.get("/", (req, res) => {
  const uptime = Math.round((Date.now() - startedAt) / 1000);
  res.json({ ok: true, uptime });
});

router.get("/health/mongo", async (req, res) => {
  try {
    // Importación dinámica para manejar ES modules en CommonJS
    const { default: prismaMongo } = await import("../lib/prismaMongo.js");
    await prismaMongo.$runCommandRaw({ ping: 1 });
    res.status(200).json({ ok: true, mongo: "up" });
  } catch (err) {
    res.status(500).json({ ok: false, error: err?.message || "Mongo ping failed" });
  }
});

module.exports = router;

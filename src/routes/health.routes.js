const { Router } = require("express");

const router = Router();
const startedAt = Date.now();

router.get("/", (req, res) => {
  const uptime = Math.round((Date.now() - startedAt) / 1000);
  res.json({ ok: true, uptime });
});

module.exports = router;

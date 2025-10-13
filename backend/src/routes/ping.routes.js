const { Router } = require("express");

const router = Router();

router.get("/", (req, res) => res.json({ pong: true }));

module.exports = router;

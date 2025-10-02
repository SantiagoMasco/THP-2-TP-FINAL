const express = require("express");
const prismaMongo = require("../lib/prismaMongo");
const router = express.Router();

// POST /mongo/settings
router.post("/", async (req, res) => {
  try {
    const { key, value } = req.body;
    const setting = await prismaMongo.appSettings.create({
      data: { key, value }
    });
    res.status(201).json(setting);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /mongo/settings
router.get("/", async (req, res) => {
  try {
    const settings = await prismaMongo.appSettings.findMany();
    res.json(settings);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /mongo/settings/:id
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const setting = await prismaMongo.appSettings.update({
      where: { id },
      data: updateData
    });
    res.json(setting);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /mongo/settings/:id
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prismaMongo.appSettings.delete({
      where: { id }
    });
    res.json({ deleted: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;

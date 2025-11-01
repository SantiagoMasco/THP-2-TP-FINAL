const express = require("express");
const prismaMongo = require("../lib/prismaMongo");
const router = express.Router();

// POST /mongo/users
router.post("/", async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await prismaMongo.user.create({
      data: { name, email }
    });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /mongo/users
router.get("/", async (req, res) => {
  try {
    const users = await prismaMongo.user.findMany();
    res.json(users);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /mongo/users/:id
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const user = await prismaMongo.user.update({
      where: { id },
      data: updateData
    });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /mongo/users/:id
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prismaMongo.user.delete({
      where: { id }
    });
    res.json({ deleted: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;

const express = require("express");
const prismaMongo = require("../lib/prismaMongo");
const router = express.Router();

// POST /mongo/tickets
router.post("/", async (req, res) => {
  try {
    const { title, userId } = req.body;
    const ticket = await prismaMongo.ticket.create({
      data: { title, userId }
    });
    res.status(201).json(ticket);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /mongo/tickets
router.get("/", async (req, res) => {
  try {
    const tickets = await prismaMongo.ticket.findMany();
    res.json(tickets);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /mongo/tickets/:id
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const ticket = await prismaMongo.ticket.update({
      where: { id },
      data: updateData
    });
    res.json(ticket);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /mongo/tickets/:id
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prismaMongo.ticket.delete({
      where: { id }
    });
    res.json({ deleted: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;

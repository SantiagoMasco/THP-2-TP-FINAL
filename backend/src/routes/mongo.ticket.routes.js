const express = require("express");
const prismaMongo = require("../lib/prismaMongo");
const { requireAuthMongo, requireRoleMongo } = require("../middleware/mongoAuth");
const { USER_ROLE } = require("../constants/enums");
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

// GET /mongo/tickets/:id
router.get("/:id", requireAuthMongo, async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await prismaMongo.ticket.findUnique({
      where: { id },
    });
    if (!ticket) {
      return res.status(404).json({ error: "Ticket no encontrado" });
    }
    return res.json(ticket);
  } catch (err) {
    return res.status(400).json({ error: err.message });
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
router.delete("/:id", requireAuthMongo, requireRoleMongo(USER_ROLE.ADMIN), async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await prismaMongo.ticket.findUnique({
      where: { id },
    });
    if (!existing) {
      return res.status(404).json({ error: "Ticket no encontrado" });
    }
    await prismaMongo.ticket.delete({
      where: { id },
    });
    return res.json({ deleted: true });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

module.exports = router;

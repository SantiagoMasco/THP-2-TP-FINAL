const express = require("express");
const prismaMongo = require("../lib/prismaMongo");
const router = express.Router();

// POST /mongo/orders
router.post("/", async (req, res) => {
  try {
    const { userId, productId } = req.body;
    
    // Validar que userId y productId existan y sean strings no vacíos
    if (!userId || typeof userId !== 'string' || userId.trim() === '') {
      throw new Error('userId is required and must be a non-empty string');
    }
    if (!productId || typeof productId !== 'string' || productId.trim() === '') {
      throw new Error('productId is required and must be a non-empty string');
    }
    
    const order = await prismaMongo.order.create({
      data: { userId, productId }
    });
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /mongo/orders
router.get("/", async (req, res) => {
  try {
    const orders = await prismaMongo.order.findMany();
    res.json(orders);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /mongo/orders/:id
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Validar userId si está presente en la actualización
    if (updateData.userId !== undefined) {
      if (!updateData.userId || typeof updateData.userId !== 'string' || updateData.userId.trim() === '') {
        throw new Error('userId must be a non-empty string');
      }
    }
    
    // Validar productId si está presente en la actualización
    if (updateData.productId !== undefined) {
      if (!updateData.productId || typeof updateData.productId !== 'string' || updateData.productId.trim() === '') {
        throw new Error('productId must be a non-empty string');
      }
    }
    
    const order = await prismaMongo.order.update({
      where: { id },
      data: updateData
    });
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /mongo/orders/:id
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prismaMongo.order.delete({
      where: { id }
    });
    res.json({ deleted: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;

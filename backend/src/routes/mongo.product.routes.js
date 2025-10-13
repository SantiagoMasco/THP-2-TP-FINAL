const express = require("express");
const prismaMongo = require("../lib/prismaMongo");
const router = express.Router();

// POST /mongo/products
router.post("/", async (req, res) => {
  try {
    const { name, price } = req.body;
    
    // Validar que price sea numérico
    if (typeof price !== 'number' || isNaN(price)) {
      throw new Error('Price must be a valid number');
    }
    
    const product = await prismaMongo.product.create({
      data: { name, price }
    });
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /mongo/products
router.get("/", async (req, res) => {
  try {
    const products = await prismaMongo.product.findMany();
    res.json(products);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /mongo/products/:id
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Validar price si está presente en la actualización
    if (updateData.price !== undefined) {
      if (typeof updateData.price !== 'number' || isNaN(updateData.price)) {
        throw new Error('Price must be a valid number');
      }
    }
    
    const product = await prismaMongo.product.update({
      where: { id },
      data: updateData
    });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /mongo/products/:id
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prismaMongo.product.delete({
      where: { id }
    });
    res.json({ deleted: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;

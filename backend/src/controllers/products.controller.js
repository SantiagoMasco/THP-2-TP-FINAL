const { ProductsRepository } = require("../repositories/products.repo");
const { 
  validateId, 
  validateRequiredString
} = require("../utils/validators");

const repos = {
  products: new ProductsRepository()
};

class ProductsController {
  async create(req, res) {
    try {
      const { name, price } = req.body;

      // Validaciones
      validateRequiredString(name, 'name');

      const product = await repos.products.create({ name, price });
      
      res.status(201).json(product);
    } catch (error) {
      // Manejar errores de validación
      if (error.message && (
        error.message.includes('required') || 
        error.message.includes('must be')
      )) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async list(req, res) {
    try {
      const products = await repos.products.findMany();
      
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async get(req, res) {
    try {
      const { id } = req.params;
      const validatedId = validateId(id);

      const product = await repos.products.findById(validatedId);
      
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.json(product);
    } catch (error) {
      // Manejar errores de validación
      if (error.message && (
        error.message.includes('required') || 
        error.message.includes('must be')
      )) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

module.exports = { ProductsController };








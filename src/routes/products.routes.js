const express = require("express");
const { ProductsController } = require("../controllers/products.controller");

const router = express.Router();
const controller = new ProductsController();

router.post("/", (req, res) => controller.create(req, res));
router.get("/", (req, res) => controller.list(req, res));
router.get("/:id", (req, res) => controller.get(req, res));

module.exports = router;



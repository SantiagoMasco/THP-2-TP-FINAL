const { Router } = require("express");
const { TicketsController } = require("../controllers/tickets.controller");

const router = Router();
const controller = new TicketsController();

// GET /tickets - Listar tickets con filtros y paginación
router.get("/", controller.list.bind(controller));

// POST /tickets - Crear ticket
router.post("/", controller.create.bind(controller));

// GET /tickets/:id - Obtener ticket por ID
router.get("/:id", controller.get.bind(controller));

// PUT /tickets/:id - Actualizar ticket
router.put("/:id", controller.update.bind(controller));

// DELETE /tickets/:id - Eliminar ticket (borrado duro)
router.delete("/:id", controller.remove.bind(controller));

module.exports = router;

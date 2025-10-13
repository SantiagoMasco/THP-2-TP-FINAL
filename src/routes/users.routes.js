const { Router } = require("express");
const { UsersController } = require("../controllers/users.controller");
const { requireAuth } = require("../middleware/auth");

const router = Router();
const controller = new UsersController();

// GET /users - Listar usuarios con paginación
router.get("/", controller.list.bind(controller));

// POST /users - Crear usuario
router.post("/", controller.create.bind(controller));

// GET /users/:userId/tickets - Obtener tickets del usuario (DEBE IR ANTES DE /:id)
router.get("/:userId/tickets", controller.getUserTickets.bind(controller));

// GET /users/:id - Obtener usuario por ID
router.get("/:id", controller.get.bind(controller));

// PUT /users/:id - Actualizar usuario
router.put("/:id", controller.update.bind(controller));

// DELETE /users/:id - Desactivar usuario (borrado lógico)
router.delete("/:id", controller.deactivate.bind(controller));

module.exports = router;

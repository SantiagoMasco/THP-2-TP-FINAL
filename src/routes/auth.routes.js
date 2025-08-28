const { Router } = require("express");
const { AuthController } = require("../controllers/auth.controller");

const router = Router();
const controller = new AuthController();

// POST /auth/signup - Registro de usuario
router.post("/signup", controller.signup.bind(controller));

// POST /auth/login - Inicio de sesión
router.post("/login", controller.login.bind(controller));

module.exports = router;


const { Router } = require("express");
const { StatsController } = require("../controllers/stats.controller");

const router = Router();
const controller = new StatsController();

// GET /stats/count-by-status - Estadísticas de conteo por status
router.get("/count-by-status", controller.countByStatus.bind(controller));

module.exports = router;

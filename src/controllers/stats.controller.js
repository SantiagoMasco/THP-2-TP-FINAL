const { TicketsRepository } = require("../repositories/tickets.repo");
const { CountByStatusUseCase } = require("../usecases/stats/count-by-status.usecase");

const repos = {
  tickets: new TicketsRepository()
};

class StatsController {
  async countByStatus(req, res) {
    try {
      const { from, to } = req.query;

      const usecase = new CountByStatusUseCase(repos);
      const result = await usecase.apply({ from, to });
      
      res.json(result);
    } catch (error) {
      if (error.message === "Invalid date format") {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

module.exports = { StatsController };

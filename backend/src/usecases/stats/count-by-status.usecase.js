const { UseCase } = require("../base");
const { VALID_TICKET_STATUSES } = require("../../constants/enums");
const { applyDateFilter } = require("../../utils/query-helpers");

class CountByStatusUseCase extends UseCase {
  constructor(repos) {
    super();
    this.repos = repos;
  }

  async apply(input) {
    // Construir filtros WHERE para fechas usando helper
    const where = {};
    applyDateFilter(where, input); // Aplica validación consistente

    // Obtener conteos por status
    const rawCounts = await this.repos.tickets.countByStatus(where);

    // Asegurar que todos los estados estén presentes
    const counts = {};
    
    for (const status of VALID_TICKET_STATUSES) {
      counts[status] = rawCounts[status] || 0;
    }

    return {
      from: input.from || null,
      to: input.to || null,
      counts
    };
  }
}

module.exports = { CountByStatusUseCase };

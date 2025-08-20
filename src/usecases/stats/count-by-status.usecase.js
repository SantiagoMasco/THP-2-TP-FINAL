const { UseCase } = require("../base");
const { VALID_TICKET_STATUSES } = require("../../constants/enums");

class CountByStatusUseCase extends UseCase {
  constructor(repos) {
    super();
    this.repos = repos;
  }

  async apply(input) {
    // Construir filtros WHERE para fechas
    const where = {};
    
    // Validar y construir filtros de fecha
    if (input.from || input.to) {
      where.createdAt = {};
      
      if (input.from) {
        const fromDate = new Date(input.from);
        if (isNaN(fromDate.getTime())) {
          throw new Error("Invalid date format");
        }
        where.createdAt.gte = fromDate;
      }
      
      if (input.to) {
        const toDate = new Date(input.to);
        if (isNaN(toDate.getTime())) {
          throw new Error("Invalid date format");
        }
        where.createdAt.lte = toDate;
      }
    }

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

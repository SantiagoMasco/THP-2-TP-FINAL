const { UseCase } = require("../base");
const { buildPagination, applyDateFilter } = require("../../utils/query-helpers");

class ListTicketsUseCase extends UseCase {
  constructor(repos) {
    super();
    this.repos = repos;
  }

  async apply(input) {
    // Paginación usando helper
    const { page, pageSize, skip, take } = buildPagination(input, 20);
    
    // Construir filtros WHERE
    const where = {};
    
    // Filtros básicos
    if (input.status) where.status = input.status;
    if (input.priority) where.priority = input.priority;
    if (input.category) where.category = input.category;
    
    // Filtros de usuarios
    if (input.assignedUserId) where.assignedUserId = parseInt(input.assignedUserId);
    if (input.createdByUserId) where.createdByUserId = parseInt(input.createdByUserId);
    
    // Filtros de fecha con validación consistente
    applyDateFilter(where, input);

    const [data, total] = await Promise.all([
      this.repos.tickets.findMany({ where, skip, take }), // Usa orderBy compuesto por defecto
      this.repos.tickets.count(where)
    ]);
    
    const totalPages = Math.ceil(total / pageSize);
    
    return {
      data,
      page,
      pageSize,
      total,
      totalPages
    };
  }
}

module.exports = { ListTicketsUseCase };

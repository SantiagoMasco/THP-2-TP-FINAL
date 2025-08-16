const { UseCase } = require("../base");
const { parsePagination } = require("../../utils/pagination");

class ListTicketsUseCase extends UseCase {
  constructor(repos) {
    super();
    this.repos = repos;
  }

  async apply(input) {
    const { page, pageSize, skip, take } = parsePagination(input);
    
    // Construir filtros WHERE
    const where = {};
    
    // Filtros básicos
    if (input.status) where.status = input.status;
    if (input.priority) where.priority = input.priority;
    if (input.category) where.category = input.category;
    
    // Filtros de usuarios
    if (input.assignedUserId) where.assignedUserId = parseInt(input.assignedUserId);
    if (input.createdByUserId) where.createdByUserId = parseInt(input.createdByUserId);
    
    // Filtros de fecha
    if (input.from || input.to) {
      where.createdAt = {};
      if (input.from) where.createdAt.gte = new Date(input.from);
      if (input.to) where.createdAt.lte = new Date(input.to);
    }

    const [data, total] = await Promise.all([
      this.repos.tickets.list({ where, skip, take }),
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

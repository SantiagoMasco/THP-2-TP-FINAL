const { UseCase } = require("../base");
const { DEFAULT_TICKET_SCOPE } = require("../../constants/enums");

class GetUserTicketsUseCase extends UseCase {
  constructor(repos) {
    super();
    this.repos = repos;
  }

  async apply(input) {
    const {
      userId,
      page = 1,
      pageSize = 20,
      scope = DEFAULT_TICKET_SCOPE,
      status
    } = input;

    // Validar que pageSize no exceda el máximo
    const maxPageSize = 50;
    const validPageSize = Math.max(1, Math.min(pageSize, maxPageSize));
    const validPage = Math.max(1, page);
    
    // Construir filtros WHERE según scope
    const where = {};
    if (scope === "assigned") {
      where.assignedUserId = userId;
    } else { // scope === "created"
      where.createdByUserId = userId;
    }

    // Agregar filtro de status si se proporciona
    if (status) {
      where.status = status;
    }

    // Calcular skip y take
    const skip = (validPage - 1) * validPageSize;
    const take = validPageSize + 1; // +1 para detectar hasNext

    // Buscar tickets con ordenamiento optimizado para índices
    const tickets = await this.repos.tickets.findMany({
      where,
      orderBy: [
        { createdAt: 'desc' },
        { id: 'desc' }
      ],
      skip,
      take
    });

    // Determinar hasNext y ajustar data
    const hasNext = tickets.length > validPageSize;
    const data = hasNext ? tickets.slice(0, validPageSize) : tickets;

    return {
      data,
      page: validPage,
      pageSize: validPageSize,
      hasNext
    };
  }
}

module.exports = { GetUserTicketsUseCase };

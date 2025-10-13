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
      status,
      search
    } = input;

    // Validar que pageSize no exceda el máximo
    const maxPageSize = 50;
    const validPageSize = Math.max(1, Math.min(pageSize, maxPageSize));
    const validPage = Math.max(1, page);
    
    // Construir filtros WHERE según scope
    const where = {};
    if (scope === "assigned") {
      where.assignedUserId = userId;
    } else if (scope === "created") {
      where.createdByUserId = userId;
    } else if (scope === "all") {
      // No filtrar por usuario - mostrar todos los tickets
      // (solo para ADMIN y AGENT, pero la validación de permisos debe hacerse en el frontend)
    } else {
      // Default: scope === "created"
      where.createdByUserId = userId;
    }

    // Agregar filtro de status si se proporciona
    if (status) {
      where.status = status;
    }

    // Agregar filtro de búsqueda por título (búsqueda con LIKE en SQLite)
    if (search && search.trim()) {
      where.title = {
        contains: search.trim()
      };
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

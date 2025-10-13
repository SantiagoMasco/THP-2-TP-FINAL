const { UseCase } = require("../base");
const { buildPagination } = require("../../utils/query-helpers");

class ListUsersUseCase extends UseCase {
  constructor(repos) {
    super();
    this.repos = repos;
  }

  async apply(input) {
    // Paginación usando helper
    const { page, pageSize, skip, take } = buildPagination(input, 20);
    
    // Construir filtros
    const where = {};
    
    // Filtro por email (búsqueda exacta)
    if (input.email) {
      where.email = input.email;
    }
    
    // Filtro por rol
    if (input.role) {
      where.role = input.role;
    }
    
    // Filtro por estado activo
    if (input.active !== undefined) {
      where.active = input.active === 'true' || input.active === true;
    }
    
    const { data, total } = await this.repos.users.paginate({ skip, take, where });
    
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

module.exports = { ListUsersUseCase };

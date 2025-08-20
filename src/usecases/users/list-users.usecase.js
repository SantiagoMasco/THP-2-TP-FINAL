const { UseCase } = require("../base");

class ListUsersUseCase extends UseCase {
  constructor(repos) {
    super();
    this.repos = repos;
  }

  async apply(input) {
    // Paginación con tamaño fijo
    const page = Math.max(1, parseInt(input.page, 10) || 1);
    const pageSize = 20; // Constante fija
    const skip = (page - 1) * pageSize;
    const take = pageSize;
    
    const { data, total } = await this.repos.users.paginate({ skip, take });
    
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

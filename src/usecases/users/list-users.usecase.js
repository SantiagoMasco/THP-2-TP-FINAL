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

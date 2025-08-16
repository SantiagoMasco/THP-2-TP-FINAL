const { UseCase } = require("../base");
const { parsePagination } = require("../../utils/pagination");

class ListUsersUseCase extends UseCase {
  constructor(repos) {
    super();
    this.repos = repos;
  }

  async apply(input) {
    const { page, pageSize, skip, take } = parsePagination(input);
    
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

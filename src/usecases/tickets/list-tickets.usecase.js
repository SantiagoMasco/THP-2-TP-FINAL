const { UseCase } = require("../base");

class ListTicketsUseCase extends UseCase {
  constructor(repos) {
    super();
    this.repos = repos;
  }

  async apply(input) {
    throw new Error("Not implemented");
  }
}

module.exports = { ListTicketsUseCase };

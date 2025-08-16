const { UseCase } = require("../base");

class UpdateTicketUseCase extends UseCase {
  constructor(repos) {
    super();
    this.repos = repos;
  }

  async apply(input) {
    throw new Error("Not implemented");
  }
}

module.exports = { UpdateTicketUseCase };

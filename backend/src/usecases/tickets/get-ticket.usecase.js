const { UseCase } = require("../base");

class GetTicketUseCase extends UseCase {
  constructor(repos) {
    super();
    this.repos = repos;
  }

  async apply(input) {
    const ticket = await this.repos.tickets.findById(input.id);
    if (!ticket) {
      throw new Error("Ticket not found");
    }
    return ticket;
  }
}

module.exports = { GetTicketUseCase };

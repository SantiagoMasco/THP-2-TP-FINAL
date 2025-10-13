const { UseCase } = require("../base");

class DeleteTicketUseCase extends UseCase {
  constructor(repos) {
    super();
    this.repos = repos;
  }

  async apply(input) {
    // Verificar que el ticket existe
    const existingTicket = await this.repos.tickets.findById(input.id);
    if (!existingTicket) {
      throw new Error("Ticket not found");
    }

    // Eliminar ticket (borrado duro)
    return await this.repos.tickets.delete(input.id);
  }
}

module.exports = { DeleteTicketUseCase };

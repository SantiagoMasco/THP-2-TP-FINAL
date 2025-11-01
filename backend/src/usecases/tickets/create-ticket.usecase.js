const { UseCase } = require("../base");

class CreateTicketUseCase extends UseCase {
  constructor(repos) {
    super();
    this.repos = repos;
  }

  async apply(input) {
    // Validar que el usuario creador existe
    const createdByUser = await this.repos.users.findById(input.createdByUserId);
    if (!createdByUser) {
      throw new Error("CreatedBy user not found");
    }

    // Validar que el producto existe (si se proporciona)
    if (input.productId) {
      const product = await this.repos.products.findById(input.productId);
      if (!product) {
        throw new Error("Product not found");
      }
    }

    // Auto-asignación round-robin a un AGENT
    const nextAgent = await this.repos.settings.getNextAgent();
    const assignedUserId = nextAgent ? nextAgent.id : null;

    // Crear ticket con auto-asignación y status inicial
    const ticketData = {
      ...input,
      assignedUserId,
      status: 'open' // Status inicial en minúsculas
    };

    const ticket = await this.repos.tickets.create(ticketData);
    
    return ticket;
  }
}

module.exports = { CreateTicketUseCase };

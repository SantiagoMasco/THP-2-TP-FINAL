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

    // Validar que el usuario asignado existe (si se proporciona)
    if (input.assignedUserId) {
      const assignedUser = await this.repos.users.findById(input.assignedUserId);
      if (!assignedUser) {
        throw new Error("Assigned user not found");
      }
    }

    // Crear ticket
    return await this.repos.tickets.create(input);
  }
}

module.exports = { CreateTicketUseCase };

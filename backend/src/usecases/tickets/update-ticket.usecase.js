const { UseCase } = require("../base");

class UpdateTicketUseCase extends UseCase {
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

    // Solo permitir actualizar campos específicos
    const allowedFields = ['status', 'priority', 'assignedUserId'];
    const updateData = {};
    
    for (const field of allowedFields) {
      if (input[field] !== undefined) {
        updateData[field] = field === 'assignedUserId' && input[field] !== null ? parseInt(input[field]) : input[field];
      }
    }

    // Validar que el usuario asignado existe (si se proporciona)
    if (updateData.assignedUserId) {
      const assignedUser = await this.repos.users.findById(updateData.assignedUserId);
      if (!assignedUser) {
        throw new Error("Assigned user not found");
      }
    }

    // Setear resolvedAt si el status cambia a resolved o closed
    if (updateData.status === 'resolved' || updateData.status === 'closed') {
      updateData.resolvedAt = new Date();
    }

    return await this.repos.tickets.update(input.id, updateData);
  }
}

module.exports = { UpdateTicketUseCase };

const { UsersRepository } = require("../repositories/users.repo");
const { TicketsRepository } = require("../repositories/tickets.repo");
const { CreateTicketUseCase } = require("../usecases/tickets/create-ticket.usecase");
const { GetTicketUseCase } = require("../usecases/tickets/get-ticket.usecase");
const { ListTicketsUseCase } = require("../usecases/tickets/list-tickets.usecase");
const { UpdateTicketUseCase } = require("../usecases/tickets/update-ticket.usecase");
const { DeleteTicketUseCase } = require("../usecases/tickets/delete-ticket.usecase");
const { 
  validateId, 
  validatePriority,
  validateStatus,
  validateRequiredString,
  validateOptionalNumber
} = require("../utils/validators");

const repos = {
  users: new UsersRepository(),
  tickets: new TicketsRepository()
};

class TicketsController {
  async create(req, res) {
    try {
      const { title, description, createdByUserId, assignedUserId, priority, category } = req.body;

      // Validaciones usando validators centralizados
      validateRequiredString(title, 'title');
      const validatedCreatedByUserId = validateId(createdByUserId, 'createdByUserId');
      if (assignedUserId) validateOptionalNumber(assignedUserId, 'assignedUserId');
      validatePriority(priority);

      const usecase = new CreateTicketUseCase(repos);
      const ticket = await usecase.apply({ 
        title, 
        description, 
        createdByUserId: validatedCreatedByUserId, 
        assignedUserId, 
        priority, 
        category 
      });
      
      res.status(201).json(ticket);
    } catch (error) {
      if (error.message === "CreatedBy user not found" || error.message === "Assigned user not found") {
        return res.status(404).json({ error: error.message });
      }
      // Manejar errores de validación
      if (error.message && (
        error.message.includes('required') || 
        error.message.includes('must be')
      )) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async get(req, res) {
    try {
      const { id } = req.params;
      const validatedId = validateId(id);

      const usecase = new GetTicketUseCase(repos);
      const ticket = await usecase.apply({ id: validatedId });
      
      res.json(ticket);
    } catch (error) {
      if (error.message === "Ticket not found") {
        return res.status(404).json({ error: error.message });
      }
      // Manejar errores de validación
      if (error.message && (
        error.message.includes('required') || 
        error.message.includes('must be')
      )) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async list(req, res) {
    try {
      const usecase = new ListTicketsUseCase(repos);
      const result = await usecase.apply(req.query);
      
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { status, priority, assignedUserId } = req.body;

      const validatedId = validateId(id);
      
      // Validaciones de tipos opcionales
      validateStatus(status);
      validatePriority(priority);
      if (assignedUserId !== undefined && assignedUserId !== null) {
        validateOptionalNumber(assignedUserId, 'assignedUserId');
      }

      const usecase = new UpdateTicketUseCase(repos);
      const ticket = await usecase.apply({ id: validatedId, status, priority, assignedUserId });
      
      res.json(ticket);
    } catch (error) {
      if (error.message === "Ticket not found" || error.message === "Assigned user not found") {
        return res.status(404).json({ error: error.message });
      }
      // Manejar errores de validación
      if (error.message && (
        error.message.includes('required') || 
        error.message.includes('must be')
      )) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async remove(req, res) {
    try {
      const { id } = req.params;
      const validatedId = validateId(id);

      const usecase = new DeleteTicketUseCase(repos);
      const result = await usecase.apply({ id: validatedId });
      
      res.json(result);
    } catch (error) {
      if (error.message === "Ticket not found") {
        return res.status(404).json({ error: error.message });
      }
      // Manejar errores de validación
      if (error.message && (
        error.message.includes('required') || 
        error.message.includes('must be')
      )) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

module.exports = { TicketsController };

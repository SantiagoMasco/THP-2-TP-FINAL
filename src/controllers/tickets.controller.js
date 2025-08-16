const { UsersRepository } = require("../repositories/users.repo");
const { TicketsRepository } = require("../repositories/tickets.repo");
const { CreateTicketUseCase } = require("../usecases/tickets/create-ticket.usecase");
const { GetTicketUseCase } = require("../usecases/tickets/get-ticket.usecase");
const { ListTicketsUseCase } = require("../usecases/tickets/list-tickets.usecase");
const { UpdateTicketUseCase } = require("../usecases/tickets/update-ticket.usecase");
const { DeleteTicketUseCase } = require("../usecases/tickets/delete-ticket.usecase");

const repos = {
  users: new UsersRepository(),
  tickets: new TicketsRepository()
};

class TicketsController {
  async create(req, res) {
    try {
      const { title, description, createdByUserId, assignedUserId, priority, category } = req.body;

      // Validaciones básicas
      if (!title || typeof title !== 'string') {
        return res.status(400).json({ error: "Title is required and must be a string" });
      }
      if (!createdByUserId || isNaN(parseInt(createdByUserId))) {
        return res.status(400).json({ error: "CreatedByUserId is required and must be a number" });
      }
      if (assignedUserId && isNaN(parseInt(assignedUserId))) {
        return res.status(400).json({ error: "AssignedUserId must be a number" });
      }
      if (priority && !['low', 'med', 'high'].includes(priority)) {
        return res.status(400).json({ error: "Priority must be low, med, or high" });
      }

      const usecase = new CreateTicketUseCase(repos);
      const ticket = await usecase.apply({ 
        title, 
        description, 
        createdByUserId, 
        assignedUserId, 
        priority, 
        category 
      });
      
      res.status(201).json(ticket);
    } catch (error) {
      if (error.message === "CreatedBy user not found" || error.message === "Assigned user not found") {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async get(req, res) {
    try {
      const { id } = req.params;

      if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({ error: "Valid ID is required" });
      }

      const usecase = new GetTicketUseCase(repos);
      const ticket = await usecase.apply({ id: parseInt(id) });
      
      res.json(ticket);
    } catch (error) {
      if (error.message === "Ticket not found") {
        return res.status(404).json({ error: error.message });
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

      if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({ error: "Valid ID is required" });
      }

      // Validaciones de tipos
      if (status && !['open', 'in_progress', 'resolved', 'closed'].includes(status)) {
        return res.status(400).json({ error: "Status must be open, in_progress, resolved, or closed" });
      }
      if (priority && !['low', 'med', 'high'].includes(priority)) {
        return res.status(400).json({ error: "Priority must be low, med, or high" });
      }
      if (assignedUserId !== undefined && assignedUserId !== null && isNaN(parseInt(assignedUserId))) {
        return res.status(400).json({ error: "AssignedUserId must be a number or null" });
      }

      const usecase = new UpdateTicketUseCase(repos);
      const ticket = await usecase.apply({ id: parseInt(id), status, priority, assignedUserId });
      
      res.json(ticket);
    } catch (error) {
      if (error.message === "Ticket not found" || error.message === "Assigned user not found") {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async remove(req, res) {
    try {
      const { id } = req.params;

      if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({ error: "Valid ID is required" });
      }

      const usecase = new DeleteTicketUseCase(repos);
      const result = await usecase.apply({ id: parseInt(id) });
      
      res.json(result);
    } catch (error) {
      if (error.message === "Ticket not found") {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

module.exports = { TicketsController };

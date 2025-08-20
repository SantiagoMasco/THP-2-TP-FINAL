const { UsersRepository } = require("../repositories/users.repo");
const { TicketsRepository } = require("../repositories/tickets.repo");
const { CreateUserUseCase } = require("../usecases/users/create-user.usecase");
const { GetUserUseCase } = require("../usecases/users/get-user.usecase");
const { ListUsersUseCase } = require("../usecases/users/list-users.usecase");
const { UpdateUserUseCase } = require("../usecases/users/update-user.usecase");
const { DeactivateUserUseCase } = require("../usecases/users/deactivate-user.usecase");
const { 
  validateId, 
  validateRole, 
  validateRequiredString, 
  validateOptionalBoolean,
  validateScope,
  validateStatus,
  parsePage,
  parsePageSize 
} = require("../utils/validators");

const repos = {
  users: new UsersRepository(),
  tickets: new TicketsRepository()
};

class UsersController {
  async create(req, res) {
    try {
      const { name, email, role } = req.body;

      // Validaciones usando validators centralizados
      validateRequiredString(name, 'name');
      validateRequiredString(email, 'email');
      validateRole(role);

      const usecase = new CreateUserUseCase(repos);
      const user = await usecase.apply({ name, email, role });
      
      res.status(201).json(user);
    } catch (error) {
      if (error.message === "Email already exists") {
        return res.status(409).json({ error: error.message });
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

      const usecase = new GetUserUseCase(repos);
      const user = await usecase.apply({ id: validatedId });
      
      res.json(user);
    } catch (error) {
      if (error.message === "User not found") {
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
      const usecase = new ListUsersUseCase(repos);
      const result = await usecase.apply(req.query);
      
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, role, active } = req.body;

      const validatedId = validateId(id);

      // Validaciones de tipos opcionales
      if (name !== undefined) validateRequiredString(name, 'name');
      validateRole(role); // ya maneja undefined internamente
      validateOptionalBoolean(active, 'active');

      const usecase = new UpdateUserUseCase(repos);
      const user = await usecase.apply({ id: validatedId, name, role, active });
      
      res.json(user);
    } catch (error) {
      if (error.message === "User not found") {
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

  async deactivate(req, res) {
    try {
      const { id } = req.params;
      const validatedId = validateId(id);

      const usecase = new DeactivateUserUseCase(repos);
      const user = await usecase.apply({ id: validatedId });
      
      res.json(user);
    } catch (error) {
      if (error.message === "User not found") {
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

  async getUserTickets(req, res) {
    try {
      const { userId } = req.params;
      const { page, pageSize, scope, status } = req.query;

      // Validaciones usando validators centralizados
      const validatedUserId = validateId(userId, 'userId');
      const pageNum = parsePage(page);
      const pageSizeNum = parsePageSize(pageSize, 20, 50);
      const scopeValue = validateScope(scope) || "assigned";
      if (status) validateStatus(status);

      // Construir filtros WHERE según scope
      const where = {};
      if (scopeValue === "assigned") {
        where.assignedUserId = validatedUserId;
      } else { // scope === "created"
        where.createdByUserId = validatedUserId;
      }

      // Agregar filtro de status si se proporciona
      if (status) {
        where.status = status;
      }

      // Calcular skip y take
      const skip = (pageNum - 1) * pageSizeNum;
      const take = pageSizeNum + 1; // +1 para detectar hasNext

      // Buscar tickets con ordenamiento
      const tickets = await repos.tickets.findMany({
        where,
        orderBy: [
          { createdAt: 'desc' },
          { id: 'desc' }
        ],
        skip,
        take
      });

      // Determinar hasNext y ajustar data
      const hasNext = tickets.length > pageSizeNum;
      const data = hasNext ? tickets.slice(0, pageSizeNum) : tickets;

      res.json({
        data,
        page: pageNum,
        pageSize: pageSizeNum,
        hasNext
      });
    } catch (error) {
      // Manejar errores de validación
      if (error.message && (
        error.message.includes('required') || 
        error.message.includes('must be') ||
        error.message.includes('Scope must be')
      )) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

module.exports = { UsersController };

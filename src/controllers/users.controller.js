const { UsersRepository } = require("../repositories/users.repo");
const { CreateUserUseCase } = require("../usecases/users/create-user.usecase");
const { GetUserUseCase } = require("../usecases/users/get-user.usecase");
const { ListUsersUseCase } = require("../usecases/users/list-users.usecase");
const { UpdateUserUseCase } = require("../usecases/users/update-user.usecase");
const { DeactivateUserUseCase } = require("../usecases/users/deactivate-user.usecase");

const repos = {
  users: new UsersRepository()
};

class UsersController {
  async create(req, res) {
    try {
      const { name, email, role } = req.body;

      // Validaciones básicas
      if (!name || typeof name !== 'string') {
        return res.status(400).json({ error: "Name is required and must be a string" });
      }
      if (!email || typeof email !== 'string') {
        return res.status(400).json({ error: "Email is required and must be a string" });
      }
      if (role && !['admin', 'agent', 'customer'].includes(role)) {
        return res.status(400).json({ error: "Role must be admin, agent, or customer" });
      }

      const usecase = new CreateUserUseCase(repos);
      const user = await usecase.apply({ name, email, role });
      
      res.status(201).json(user);
    } catch (error) {
      if (error.message === "Email already exists") {
        return res.status(409).json({ error: error.message });
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

      const usecase = new GetUserUseCase(repos);
      const user = await usecase.apply({ id: parseInt(id) });
      
      res.json(user);
    } catch (error) {
      if (error.message === "User not found") {
        return res.status(404).json({ error: error.message });
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

      if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({ error: "Valid ID is required" });
      }

      // Validaciones de tipos
      if (name !== undefined && typeof name !== 'string') {
        return res.status(400).json({ error: "Name must be a string" });
      }
      if (role !== undefined && !['admin', 'agent', 'customer'].includes(role)) {
        return res.status(400).json({ error: "Role must be admin, agent, or customer" });
      }
      if (active !== undefined && typeof active !== 'boolean') {
        return res.status(400).json({ error: "Active must be a boolean" });
      }

      const usecase = new UpdateUserUseCase(repos);
      const user = await usecase.apply({ id: parseInt(id), name, role, active });
      
      res.json(user);
    } catch (error) {
      if (error.message === "User not found") {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async deactivate(req, res) {
    try {
      const { id } = req.params;

      if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({ error: "Valid ID is required" });
      }

      const usecase = new DeactivateUserUseCase(repos);
      const user = await usecase.apply({ id: parseInt(id) });
      
      res.json(user);
    } catch (error) {
      if (error.message === "User not found") {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

module.exports = { UsersController };

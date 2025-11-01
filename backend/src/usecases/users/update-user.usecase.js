const { UseCase } = require("../base");

class UpdateUserUseCase extends UseCase {
  constructor(repos) {
    super();
    this.repos = repos;
  }

  async apply(input) {
    // Verificar que el usuario existe
    const existingUser = await this.repos.users.findById(input.id);
    if (!existingUser) {
      throw new Error("User not found");
    }

    // Solo permitir actualizar campos específicos
    const allowedFields = ['name', 'role', 'active'];
    const updateData = {};
    
    for (const field of allowedFields) {
      if (input[field] !== undefined) {
        updateData[field] = input[field];
      }
    }

    return await this.repos.users.update(input.id, updateData);
  }
}

module.exports = { UpdateUserUseCase };

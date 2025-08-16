const { UseCase } = require("../base");

class DeactivateUserUseCase extends UseCase {
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

    // Desactivar usuario (borrado lógico)
    return await this.repos.users.update(input.id, { active: false });
  }
}

module.exports = { DeactivateUserUseCase };

const { UseCase } = require("../base");

class CreateUserUseCase extends UseCase {
  constructor(repos) {
    super();
    this.repos = repos;
  }

  async apply(input) {
    // Validar que el email sea único
    const existingUser = await this.repos.users.findByEmail(input.email);
    if (existingUser) {
      throw new Error("Email already exists");
    }

    // Crear usuario
    return await this.repos.users.create(input);
  }
}

module.exports = { CreateUserUseCase };

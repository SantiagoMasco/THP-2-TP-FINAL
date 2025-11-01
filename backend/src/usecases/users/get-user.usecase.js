const { UseCase } = require("../base");

class GetUserUseCase extends UseCase {
  constructor(repos) {
    super();
    this.repos = repos;
  }

  async apply(input) {
    const user = await this.repos.users.findById(input.id);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }
}

module.exports = { GetUserUseCase };

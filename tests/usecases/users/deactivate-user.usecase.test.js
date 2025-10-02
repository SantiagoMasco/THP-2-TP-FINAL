const { DeactivateUserUseCase } = require("../../../src/usecases/users/deactivate-user.usecase");

describe("DeactivateUserUseCase", () => {
  let usecase;
  let mockRepos;

  beforeEach(() => {
    mockRepos = {
      users: {
        findById: jest.fn(),
        update: jest.fn()
      }
    };
    usecase = new DeactivateUserUseCase(mockRepos);
  });

  it("desactiva usuario existente", async () => {
    const input = { id: 1 };
    const existingUser = { id: 1, name: "John", email: "john@example.com", active: true };
    const deactivatedUser = { ...existingUser, active: false };

    mockRepos.users.findById.mockResolvedValue(existingUser);
    mockRepos.users.update.mockResolvedValue(deactivatedUser);

    const result = await usecase.apply(input);

    expect(mockRepos.users.findById).toHaveBeenCalledWith(1);
    expect(mockRepos.users.update).toHaveBeenCalledWith(1, { active: false });
    expect(result).toEqual(deactivatedUser);
  });

  it("falla cuando usuario no existe", async () => {
    const input = { id: 999 };

    mockRepos.users.findById.mockResolvedValue(null);

    await expect(usecase.apply(input)).rejects.toThrow("User not found");
    expect(mockRepos.users.update).not.toHaveBeenCalled();
  });
});

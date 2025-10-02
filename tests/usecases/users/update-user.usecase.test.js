const { UpdateUserUseCase } = require("../../../src/usecases/users/update-user.usecase");

describe("UpdateUserUseCase", () => {
  let usecase;
  let mockRepos;

  beforeEach(() => {
    mockRepos = {
      users: {
        findById: jest.fn(),
        update: jest.fn()
      }
    };
    usecase = new UpdateUserUseCase(mockRepos);
  });

  it("actualiza solo campos permitidos", async () => {
    const input = {
      id: 1,
      name: "New Name",
      role: "admin",
      active: false,
      email: "hacker@evil.com", // No debe actualizar email
      extraField: "should be ignored"
    };

    const existingUser = { id: 1, name: "Old Name", email: "user@example.com", role: "customer" };
    const updatedUser = { id: 1, name: "New Name", email: "user@example.com", role: "admin", active: false };

    mockRepos.users.findById.mockResolvedValue(existingUser);
    mockRepos.users.update.mockResolvedValue(updatedUser);

    const result = await usecase.apply(input);

    expect(mockRepos.users.findById).toHaveBeenCalledWith(1);
    expect(mockRepos.users.update).toHaveBeenCalledWith(1, {
      name: "New Name",
      role: "admin", 
      active: false
    });
    expect(result).toEqual(updatedUser);
  });

  it("falla cuando usuario no existe", async () => {
    const input = { id: 999, name: "New Name" };

    mockRepos.users.findById.mockResolvedValue(null);

    await expect(usecase.apply(input)).rejects.toThrow("User not found");
    expect(mockRepos.users.update).not.toHaveBeenCalled();
  });
});

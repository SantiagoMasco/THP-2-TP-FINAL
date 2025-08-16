const { GetUserUseCase } = require("../../../src/usecases/users/get-user.usecase");

describe("GetUserUseCase", () => {
  let usecase;
  let mockRepos;

  beforeEach(() => {
    mockRepos = {
      users: {
        findById: jest.fn()
      }
    };
    usecase = new GetUserUseCase(mockRepos);
  });

  it("retorna usuario cuando existe", async () => {
    const input = { id: 1 };
    const user = { id: 1, name: "John", email: "john@example.com", role: "customer" };

    mockRepos.users.findById.mockResolvedValue(user);

    const result = await usecase.apply(input);

    expect(mockRepos.users.findById).toHaveBeenCalledWith(1);
    expect(result).toEqual(user);
  });

  it("falla cuando usuario no existe", async () => {
    const input = { id: 999 };

    mockRepos.users.findById.mockResolvedValue(null);

    await expect(usecase.apply(input)).rejects.toThrow("User not found");
  });
});

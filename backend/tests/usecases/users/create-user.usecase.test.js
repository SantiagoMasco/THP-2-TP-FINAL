const { CreateUserUseCase } = require("../../../src/usecases/users/create-user.usecase");

describe("CreateUserUseCase", () => {
  let usecase;
  let mockRepos;

  beforeEach(() => {
    mockRepos = {
      users: {
        findByEmail: jest.fn(),
        create: jest.fn()
      }
    };
    usecase = new CreateUserUseCase(mockRepos);
  });

  it("crea usuario cuando email es único", async () => {
    const input = {
      name: "John Doe",
      email: "john@example.com",
      role: "customer"
    };

    mockRepos.users.findByEmail.mockResolvedValue(null);
    mockRepos.users.create.mockResolvedValue({ id: 1, ...input });

    const result = await usecase.apply(input);

    expect(mockRepos.users.findByEmail).toHaveBeenCalledWith("john@example.com");
    expect(mockRepos.users.create).toHaveBeenCalledWith(input);
    expect(result).toEqual({ id: 1, ...input });
  });

  it("falla cuando email ya existe", async () => {
    const input = {
      name: "John Doe", 
      email: "existing@example.com",
      role: "customer"
    };

    mockRepos.users.findByEmail.mockResolvedValue({ id: 1, email: "existing@example.com" });

    await expect(usecase.apply(input)).rejects.toThrow("Email already exists");
    expect(mockRepos.users.create).not.toHaveBeenCalled();
  });
});

const { ListUsersUseCase } = require("../../../src/usecases/users/list-users.usecase");

describe("ListUsersUseCase", () => {
  let usecase;
  let mockRepos;

  beforeEach(() => {
    mockRepos = {
      users: {
        paginate: jest.fn()
      }
    };
    usecase = new ListUsersUseCase(mockRepos);
  });

  it("lista usuarios con paginación", async () => {
    const input = { page: "2" };
    const users = [
      { id: 1, name: "User 1" },
      { id: 2, name: "User 2" }
    ];
    const total = 40;

    mockRepos.users.paginate.mockResolvedValue({ data: users, total });

    const result = await usecase.apply(input);

    expect(mockRepos.users.paginate).toHaveBeenCalledWith({ skip: 20, take: 20 });
    expect(result).toEqual({
      data: users,
      page: 2,
      pageSize: 20,
      total: 40,
      totalPages: 2
    });
  });

  it("usa valores por defecto para paginación", async () => {
    const input = {};
    const users = [];
    const total = 0;

    mockRepos.users.paginate.mockResolvedValue({ data: users, total });

    const result = await usecase.apply(input);

    expect(mockRepos.users.paginate).toHaveBeenCalledWith({ skip: 0, take: 20 });
    expect(result).toEqual({
      data: users,
      page: 1,
      pageSize: 20,
      total: 0,
      totalPages: 0
    });
  });
});
const { ListUsersUseCase } = require("../../../src/usecases/users/list-users.usecase");
const { parsePagination } = require("../../../src/utils/pagination");

jest.mock("../../../src/utils/pagination");

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
    const input = { page: "2", pageSize: "5" };
    const paginationData = { page: 2, pageSize: 5, skip: 5, take: 5 };
    const users = [
      { id: 1, name: "User 1" },
      { id: 2, name: "User 2" }
    ];
    const total = 20;

    parsePagination.mockReturnValue(paginationData);
    mockRepos.users.paginate.mockResolvedValue({ data: users, total });

    const result = await usecase.apply(input);

    expect(parsePagination).toHaveBeenCalledWith(input);
    expect(mockRepos.users.paginate).toHaveBeenCalledWith({ skip: 5, take: 5 });
    expect(result).toEqual({
      data: users,
      page: 2,
      pageSize: 5,
      total: 20,
      totalPages: 4
    });
  });

  it("usa valores por defecto para paginación", async () => {
    const input = {};
    const paginationData = { page: 1, pageSize: 20, skip: 0, take: 20 };
    const users = [];
    const total = 0;

    parsePagination.mockReturnValue(paginationData);
    mockRepos.users.paginate.mockResolvedValue({ data: users, total });

    const result = await usecase.apply(input);

    expect(result).toEqual({
      data: users,
      page: 1,
      pageSize: 20,
      total: 0,
      totalPages: 0
    });
  });
});

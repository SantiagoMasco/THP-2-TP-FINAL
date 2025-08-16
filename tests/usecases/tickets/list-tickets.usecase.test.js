const { ListTicketsUseCase } = require("../../../src/usecases/tickets/list-tickets.usecase");
const { parsePagination } = require("../../../src/utils/pagination");

jest.mock("../../../src/utils/pagination");

describe("ListTicketsUseCase", () => {
  let usecase;
  let mockRepos;

  beforeEach(() => {
    mockRepos = {
      tickets: {
        list: jest.fn(),
        count: jest.fn()
      }
    };
    usecase = new ListTicketsUseCase(mockRepos);
  });

  it("lista tickets con paginación básica", async () => {
    const input = { page: "1", pageSize: "10" };
    const paginationData = { page: 1, pageSize: 10, skip: 0, take: 10 };
    const tickets = [
      { id: 1, title: "Ticket 1", status: "open" },
      { id: 2, title: "Ticket 2", status: "closed" }
    ];
    const total = 2;

    parsePagination.mockReturnValue(paginationData);
    mockRepos.tickets.list.mockResolvedValue(tickets);
    mockRepos.tickets.count.mockResolvedValue(total);

    const result = await usecase.apply(input);

    expect(parsePagination).toHaveBeenCalledWith(input);
    expect(mockRepos.tickets.list).toHaveBeenCalledWith({
      where: {},
      skip: 0,
      take: 10
    });
    expect(mockRepos.tickets.count).toHaveBeenCalledWith({});
    expect(result).toEqual({
      data: tickets,
      page: 1,
      pageSize: 10,
      total: 2,
      totalPages: 1
    });
  });

  it("aplica filtros de status, priority, category", async () => {
    const input = {
      status: "open",
      priority: "high",
      category: "bug",
      page: "1"
    };
    const paginationData = { page: 1, pageSize: 20, skip: 0, take: 20 };

    parsePagination.mockReturnValue(paginationData);
    mockRepos.tickets.list.mockResolvedValue([]);
    mockRepos.tickets.count.mockResolvedValue(0);

    await usecase.apply(input);

    const expectedWhere = {
      status: "open",
      priority: "high",
      category: "bug"
    };

    expect(mockRepos.tickets.list).toHaveBeenCalledWith({
      where: expectedWhere,
      skip: 0,
      take: 20
    });
    expect(mockRepos.tickets.count).toHaveBeenCalledWith(expectedWhere);
  });

  it("aplica filtros de usuarios (assignedUserId, createdByUserId)", async () => {
    const input = {
      assignedUserId: "2",
      createdByUserId: "1"
    };
    const paginationData = { page: 1, pageSize: 20, skip: 0, take: 20 };

    parsePagination.mockReturnValue(paginationData);
    mockRepos.tickets.list.mockResolvedValue([]);
    mockRepos.tickets.count.mockResolvedValue(0);

    await usecase.apply(input);

    const expectedWhere = {
      assignedUserId: 2,
      createdByUserId: 1
    };

    expect(mockRepos.tickets.list).toHaveBeenCalledWith({
      where: expectedWhere,
      skip: 0,
      take: 20
    });
  });

  it("aplica filtros de fecha (from, to)", async () => {
    const input = {
      from: "2024-01-01",
      to: "2024-01-31"
    };
    const paginationData = { page: 1, pageSize: 20, skip: 0, take: 20 };

    parsePagination.mockReturnValue(paginationData);
    mockRepos.tickets.list.mockResolvedValue([]);
    mockRepos.tickets.count.mockResolvedValue(0);

    await usecase.apply(input);

    const expectedWhere = {
      createdAt: {
        gte: new Date("2024-01-01"),
        lte: new Date("2024-01-31")
      }
    };

    expect(mockRepos.tickets.list).toHaveBeenCalledWith({
      where: expectedWhere,
      skip: 0,
      take: 20
    });
  });

  it("combina múltiples filtros", async () => {
    const input = {
      status: "in_progress",
      assignedUserId: "3",
      from: "2024-01-01"
    };
    const paginationData = { page: 1, pageSize: 20, skip: 0, take: 20 };

    parsePagination.mockReturnValue(paginationData);
    mockRepos.tickets.list.mockResolvedValue([]);
    mockRepos.tickets.count.mockResolvedValue(0);

    await usecase.apply(input);

    const expectedWhere = {
      status: "in_progress",
      assignedUserId: 3,
      createdAt: {
        gte: new Date("2024-01-01")
      }
    };

    expect(mockRepos.tickets.list).toHaveBeenCalledWith({
      where: expectedWhere,
      skip: 0,
      take: 20
    });
  });
});

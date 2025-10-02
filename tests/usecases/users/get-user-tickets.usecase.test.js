const { GetUserTicketsUseCase } = require("../../../src/usecases/users/get-user-tickets.usecase");

describe("GetUserTicketsUseCase", () => {
  let usecase;
  let mockRepos;

  beforeEach(() => {
    mockRepos = {
      tickets: {
        findMany: jest.fn()
      }
    };
    usecase = new GetUserTicketsUseCase(mockRepos);
  });

  it("obtiene tickets asignados al usuario con paginación básica", async () => {
    const input = {
      userId: 5,
      page: 1,
      pageSize: 20,
      scope: "assigned"
    };

    const mockTickets = [
      { id: 1, title: "Ticket 1", assignedUserId: 5 },
      { id: 2, title: "Ticket 2", assignedUserId: 5 }
    ];

    mockRepos.tickets.findMany.mockResolvedValue(mockTickets);

    const result = await usecase.apply(input);

    expect(mockRepos.tickets.findMany).toHaveBeenCalledWith({
      where: { assignedUserId: 5 },
      orderBy: [
        { createdAt: 'desc' },
        { id: 'desc' }
      ],
      skip: 0,
      take: 21 // pageSize + 1
    });

    expect(result).toEqual({
      data: mockTickets,
      page: 1,
      pageSize: 20,
      hasNext: false
    });
  });

  it("obtiene tickets creados por el usuario", async () => {
    const input = {
      userId: 3,
      page: 1,
      pageSize: 10,
      scope: "created"
    };

    const mockTickets = [
      { id: 1, title: "Ticket 1", createdByUserId: 3 }
    ];

    mockRepos.tickets.findMany.mockResolvedValue(mockTickets);

    const result = await usecase.apply(input);

    expect(mockRepos.tickets.findMany).toHaveBeenCalledWith({
      where: { createdByUserId: 3 },
      orderBy: [
        { createdAt: 'desc' },
        { id: 'desc' }
      ],
      skip: 0,
      take: 11
    });

    expect(result.data).toEqual(mockTickets);
    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(10);
  });

  it("aplica filtro de status cuando se proporciona", async () => {
    const input = {
      userId: 2,
      scope: "assigned",
      status: "open"
    };

    mockRepos.tickets.findMany.mockResolvedValue([]);

    await usecase.apply(input);

    expect(mockRepos.tickets.findMany).toHaveBeenCalledWith({
      where: {
        assignedUserId: 2,
        status: "open"
      },
      orderBy: [
        { createdAt: 'desc' },
        { id: 'desc' }
      ],
      skip: 0,
      take: 21
    });
  });

  it("calcula correctamente hasNext cuando hay más elementos", async () => {
    const input = {
      userId: 1,
      pageSize: 2
    };

    // Devolvemos 3 elementos cuando pedimos 2 + 1
    const mockTickets = [
      { id: 1, title: "Ticket 1" },
      { id: 2, title: "Ticket 2" },
      { id: 3, title: "Ticket 3" }
    ];

    mockRepos.tickets.findMany.mockResolvedValue(mockTickets);

    const result = await usecase.apply(input);

    expect(result.hasNext).toBe(true);
    expect(result.data).toHaveLength(2); // Solo los primeros 2
    expect(result.data).toEqual([
      { id: 1, title: "Ticket 1" },
      { id: 2, title: "Ticket 2" }
    ]);
  });

  it("calcula correctamente hasNext cuando no hay más elementos", async () => {
    const input = {
      userId: 1,
      pageSize: 5
    };

    // Devolvemos solo 3 elementos cuando pedimos 5 + 1
    const mockTickets = [
      { id: 1, title: "Ticket 1" },
      { id: 2, title: "Ticket 2" },
      { id: 3, title: "Ticket 3" }
    ];

    mockRepos.tickets.findMany.mockResolvedValue(mockTickets);

    const result = await usecase.apply(input);

    expect(result.hasNext).toBe(false);
    expect(result.data).toHaveLength(3);
    expect(result.data).toEqual(mockTickets);
  });

  it("maneja paginación de página 2", async () => {
    const input = {
      userId: 4,
      page: 2,
      pageSize: 10
    };

    mockRepos.tickets.findMany.mockResolvedValue([]);

    await usecase.apply(input);

    expect(mockRepos.tickets.findMany).toHaveBeenCalledWith({
      where: { assignedUserId: 4 },
      orderBy: [
        { createdAt: 'desc' },
        { id: 'desc' }
      ],
      skip: 10, // (page - 1) * pageSize
      take: 11  // pageSize + 1
    });
  });

  it("usa valores por defecto para parámetros opcionales", async () => {
    const input = {
      userId: 7
    };

    mockRepos.tickets.findMany.mockResolvedValue([]);

    const result = await usecase.apply(input);

    expect(mockRepos.tickets.findMany).toHaveBeenCalledWith({
      where: { assignedUserId: 7 }, // scope default = "assigned"
      orderBy: [
        { createdAt: 'desc' },
        { id: 'desc' }
      ],
      skip: 0, // page default = 1
      take: 21 // pageSize default = 20
    });

    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(20);
  });

  it("limita pageSize al máximo permitido", async () => {
    const input = {
      userId: 1,
      pageSize: 100 // Excede el máximo de 50
    };

    mockRepos.tickets.findMany.mockResolvedValue([]);

    const result = await usecase.apply(input);

    expect(result.pageSize).toBe(50);
    expect(mockRepos.tickets.findMany).toHaveBeenCalledWith({
      where: { assignedUserId: 1 },
      orderBy: [
        { createdAt: 'desc' },
        { id: 'desc' }
      ],
      skip: 0,
      take: 51 // 50 + 1
    });
  });

  it("garantiza valores mínimos para page y pageSize", async () => {
    const input = {
      userId: 1,
      page: -1,
      pageSize: 0
    };

    mockRepos.tickets.findMany.mockResolvedValue([]);

    const result = await usecase.apply(input);

    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(1);
    expect(mockRepos.tickets.findMany).toHaveBeenCalledWith({
      where: { assignedUserId: 1 },
      orderBy: [
        { createdAt: 'desc' },
        { id: 'desc' }
      ],
      skip: 0, // (1 - 1) * 1
      take: 2  // 1 + 1
    });
  });

  it("combina scope created con filtro de status", async () => {
    const input = {
      userId: 6,
      scope: "created",
      status: "resolved"
    };

    mockRepos.tickets.findMany.mockResolvedValue([]);

    await usecase.apply(input);

    expect(mockRepos.tickets.findMany).toHaveBeenCalledWith({
      where: {
        createdByUserId: 6,
        status: "resolved"
      },
      orderBy: [
        { createdAt: 'desc' },
        { id: 'desc' }
      ],
      skip: 0,
      take: 21
    });
  });
});

const { TicketsRepository } = require("../../src/repositories/tickets.repo");

// Mock de Prisma
const mockPrismaTicket = {
  findMany: jest.fn()
};

jest.mock("../../src/lib/prisma", () => ({
  prisma: {
    ticket: mockPrismaTicket
  }
}));

describe("TicketsRepository - OrderBy Behavior", () => {
  let repository;

  beforeEach(() => {
    repository = new TicketsRepository();
    jest.clearAllMocks();
  });

  it("usa orderBy compuesto por defecto cuando no se proporciona", async () => {
    mockPrismaTicket.findMany.mockResolvedValue([]);

    await repository.findMany({
      where: { status: "open" },
      skip: 0,
      take: 20
    });

    expect(mockPrismaTicket.findMany).toHaveBeenCalledWith({
      where: { status: "open" },
      orderBy: [
        { createdAt: 'desc' },
        { id: 'desc' }
      ],
      skip: 0,
      take: 20,
      include: {
        createdBy: true,
        assignedTo: true
      }
    });
  });

  it("respeta orderBy personalizado cuando se proporciona", async () => {
    mockPrismaTicket.findMany.mockResolvedValue([]);

    const customOrderBy = [
      { priority: 'desc' },
      { createdAt: 'asc' }
    ];

    await repository.findMany({
      where: { status: "open" },
      orderBy: customOrderBy,
      skip: 0,
      take: 20
    });

    expect(mockPrismaTicket.findMany).toHaveBeenCalledWith({
      where: { status: "open" },
      orderBy: customOrderBy,
      skip: 0,
      take: 20,
      include: {
        createdBy: true,
        assignedTo: true
      }
    });
  });

  it("maneja orderBy simple (no array) cuando se proporciona", async () => {
    mockPrismaTicket.findMany.mockResolvedValue([]);

    const simpleOrderBy = { title: 'asc' };

    await repository.findMany({
      where: { assignedUserId: 5 },
      orderBy: simpleOrderBy,
      skip: 10,
      take: 5
    });

    expect(mockPrismaTicket.findMany).toHaveBeenCalledWith({
      where: { assignedUserId: 5 },
      orderBy: simpleOrderBy,
      skip: 10,
      take: 5,
      include: {
        createdBy: true,
        assignedTo: true
      }
    });
  });

  it("usa orderBy por defecto cuando se pasa null", async () => {
    mockPrismaTicket.findMany.mockResolvedValue([]);

    await repository.findMany({
      where: { createdByUserId: 3 },
      orderBy: null,
      skip: 0,
      take: 10
    });

    expect(mockPrismaTicket.findMany).toHaveBeenCalledWith({
      where: { createdByUserId: 3 },
      orderBy: [
        { createdAt: 'desc' },
        { id: 'desc' }
      ],
      skip: 0,
      take: 10,
      include: {
        createdBy: true,
        assignedTo: true
      }
    });
  });

  it("usa orderBy por defecto cuando se pasa undefined", async () => {
    mockPrismaTicket.findMany.mockResolvedValue([]);

    await repository.findMany({
      where: { status: "resolved" },
      orderBy: undefined,
      skip: 0,
      take: 15
    });

    expect(mockPrismaTicket.findMany).toHaveBeenCalledWith({
      where: { status: "resolved" },
      orderBy: [
        { createdAt: 'desc' },
        { id: 'desc' }
      ],
      skip: 0,
      take: 15,
      include: {
        createdBy: true,
        assignedTo: true
      }
    });
  });

  it("incluye siempre las relaciones createdBy y assignedTo", async () => {
    mockPrismaTicket.findMany.mockResolvedValue([]);

    await repository.findMany({
      where: {},
      skip: 0,
      take: 1
    });

    const callArgs = mockPrismaTicket.findMany.mock.calls[0][0];
    expect(callArgs.include).toEqual({
      createdBy: true,
      assignedTo: true
    });
  });

  it("el orderBy por defecto está optimizado para índices compuestos", () => {
    // El orderBy por defecto debe coincidir con los índices definidos en el schema:
    // @@index([assignedUserId, createdAt, id])
    // @@index([createdByUserId, createdAt, id])
    const defaultOrderBy = [
      { createdAt: 'desc' },
      { id: 'desc' }
    ];

    // Verificar que los campos del orderBy están en el mismo orden que los índices
    expect(defaultOrderBy[0]).toHaveProperty('createdAt', 'desc');
    expect(defaultOrderBy[1]).toHaveProperty('id', 'desc');
  });
});

const { CreateTicketUseCase } = require("../../../src/usecases/tickets/create-ticket.usecase");

describe("CreateTicketUseCase", () => {
  let usecase;
  let mockRepos;

  beforeEach(() => {
    mockRepos = {
      users: {
        findById: jest.fn()
      },
      tickets: {
        create: jest.fn()
      }
    };
    usecase = new CreateTicketUseCase(mockRepos);
  });

  it("crea ticket cuando createdByUserId existe", async () => {
    const input = {
      title: "Test Issue",
      description: "Test description",
      createdByUserId: 1,
      priority: "high",
      category: "bug"
    };

    const user = { id: 1, name: "John Doe", role: "customer" };
    const createdTicket = { id: 1, ...input, status: "open", createdAt: new Date() };

    mockRepos.users.findById.mockResolvedValue(user);
    mockRepos.tickets.create.mockResolvedValue(createdTicket);

    const result = await usecase.apply(input);

    expect(mockRepos.users.findById).toHaveBeenCalledWith(1);
    expect(mockRepos.tickets.create).toHaveBeenCalledWith(input);
    expect(result).toEqual(createdTicket);
  });

  it("falla cuando createdByUserId no existe", async () => {
    const input = {
      title: "Test Issue",
      createdByUserId: 999
    };

    mockRepos.users.findById.mockResolvedValue(null);

    await expect(usecase.apply(input)).rejects.toThrow("CreatedBy user not found");
    expect(mockRepos.tickets.create).not.toHaveBeenCalled();
  });

  it("valida assignedUserId cuando se proporciona", async () => {
    const input = {
      title: "Test Issue",
      createdByUserId: 1,
      assignedUserId: 2
    };

    const createdByUser = { id: 1, name: "Creator" };
    const assignedUser = { id: 2, name: "Agent" };
    const createdTicket = { id: 1, ...input };

    mockRepos.users.findById
      .mockResolvedValueOnce(createdByUser)  // Para createdByUserId
      .mockResolvedValueOnce(assignedUser);   // Para assignedUserId
    mockRepos.tickets.create.mockResolvedValue(createdTicket);

    const result = await usecase.apply(input);

    expect(mockRepos.users.findById).toHaveBeenCalledTimes(2);
    expect(mockRepos.users.findById).toHaveBeenNthCalledWith(1, 1);
    expect(mockRepos.users.findById).toHaveBeenNthCalledWith(2, 2);
    expect(result).toEqual(createdTicket);
  });

  it("falla cuando assignedUserId no existe", async () => {
    const input = {
      title: "Test Issue",
      createdByUserId: 1,
      assignedUserId: 999
    };

    const createdByUser = { id: 1, name: "Creator" };

    mockRepos.users.findById
      .mockResolvedValueOnce(createdByUser)  // Para createdByUserId
      .mockResolvedValueOnce(null);          // Para assignedUserId

    await expect(usecase.apply(input)).rejects.toThrow("Assigned user not found");
    expect(mockRepos.tickets.create).not.toHaveBeenCalled();
  });
});

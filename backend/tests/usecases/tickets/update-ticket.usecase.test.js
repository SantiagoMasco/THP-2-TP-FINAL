const { UpdateTicketUseCase } = require("../../../src/usecases/tickets/update-ticket.usecase");

describe("UpdateTicketUseCase", () => {
  let usecase;
  let mockRepos;

  beforeEach(() => {
    mockRepos = {
      tickets: {
        findById: jest.fn(),
        update: jest.fn()
      },
      users: {
        findById: jest.fn()
      }
    };
    usecase = new UpdateTicketUseCase(mockRepos);
  });

  it("actualiza campos permitidos del ticket", async () => {
    const input = {
      id: 1,
      status: "in_progress",
      priority: "high",
      assignedUserId: 2,
      extraField: "should be ignored"
    };

    const existingTicket = {
      id: 1,
      title: "Test",
      status: "open",
      priority: "med",
      assignedUserId: null
    };

    const assignedUser = { id: 2, name: "Agent" };
    const updatedTicket = { ...existingTicket, status: "in_progress", priority: "high", assignedUserId: 2 };

    mockRepos.tickets.findById.mockResolvedValue(existingTicket);
    mockRepos.users.findById.mockResolvedValue(assignedUser);
    mockRepos.tickets.update.mockResolvedValue(updatedTicket);

    const result = await usecase.apply(input);

    expect(mockRepos.tickets.findById).toHaveBeenCalledWith(1);
    expect(mockRepos.users.findById).toHaveBeenCalledWith(2);
    expect(mockRepos.tickets.update).toHaveBeenCalledWith(1, {
      status: "in_progress",
      priority: "high", 
      assignedUserId: 2
    });
    expect(result).toEqual(updatedTicket);
  });

  it("falla cuando ticket no existe", async () => {
    const input = { id: 999, status: "closed" };

    mockRepos.tickets.findById.mockResolvedValue(null);

    await expect(usecase.apply(input)).rejects.toThrow("Ticket not found");
    expect(mockRepos.tickets.update).not.toHaveBeenCalled();
  });

  it("falla cuando assignedUserId no existe", async () => {
    const input = {
      id: 1,
      assignedUserId: 999
    };

    const existingTicket = { id: 1, title: "Test" };

    mockRepos.tickets.findById.mockResolvedValue(existingTicket);
    mockRepos.users.findById.mockResolvedValue(null);

    await expect(usecase.apply(input)).rejects.toThrow("Assigned user not found");
    expect(mockRepos.tickets.update).not.toHaveBeenCalled();
  });

  it("setea resolvedAt cuando status cambia a resolved", async () => {
    const input = {
      id: 1,
      status: "resolved"
    };

    const existingTicket = { id: 1, status: "in_progress", resolvedAt: null };
    const updatedTicket = { ...existingTicket, status: "resolved", resolvedAt: new Date() };

    mockRepos.tickets.findById.mockResolvedValue(existingTicket);
    mockRepos.tickets.update.mockResolvedValue(updatedTicket);

    const result = await usecase.apply(input);

    expect(mockRepos.tickets.update).toHaveBeenCalledWith(1, expect.objectContaining({
      status: "resolved",
      resolvedAt: expect.any(Date)
    }));
  });

  it("setea resolvedAt cuando status cambia a closed", async () => {
    const input = {
      id: 1,
      status: "closed"
    };

    const existingTicket = { id: 1, status: "resolved", resolvedAt: null };

    mockRepos.tickets.findById.mockResolvedValue(existingTicket);
    mockRepos.tickets.update.mockResolvedValue({ ...existingTicket, status: "closed" });

    await usecase.apply(input);

    expect(mockRepos.tickets.update).toHaveBeenCalledWith(1, expect.objectContaining({
      status: "closed",
      resolvedAt: expect.any(Date)
    }));
  });

  it("no setea resolvedAt para otros estados", async () => {
    const input = {
      id: 1,
      status: "in_progress"
    };

    const existingTicket = { id: 1, status: "open" };

    mockRepos.tickets.findById.mockResolvedValue(existingTicket);
    mockRepos.tickets.update.mockResolvedValue({ ...existingTicket, status: "in_progress" });

    await usecase.apply(input);

    expect(mockRepos.tickets.update).toHaveBeenCalledWith(1, {
      status: "in_progress"
    });
  });
});

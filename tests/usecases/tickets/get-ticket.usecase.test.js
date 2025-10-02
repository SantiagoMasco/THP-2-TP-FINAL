const { GetTicketUseCase } = require("../../../src/usecases/tickets/get-ticket.usecase");

describe("GetTicketUseCase", () => {
  let usecase;
  let mockRepos;

  beforeEach(() => {
    mockRepos = {
      tickets: {
        findById: jest.fn()
      }
    };
    usecase = new GetTicketUseCase(mockRepos);
  });

  it("retorna ticket cuando existe", async () => {
    const input = { id: 1 };
    const ticket = {
      id: 1,
      title: "Test Issue",
      description: "Test description",
      status: "open",
      priority: "med",
      createdByUserId: 1,
      assignedUserId: 2
    };

    mockRepos.tickets.findById.mockResolvedValue(ticket);

    const result = await usecase.apply(input);

    expect(mockRepos.tickets.findById).toHaveBeenCalledWith(1);
    expect(result).toEqual(ticket);
  });

  it("falla cuando ticket no existe", async () => {
    const input = { id: 999 };

    mockRepos.tickets.findById.mockResolvedValue(null);

    await expect(usecase.apply(input)).rejects.toThrow("Ticket not found");
  });
});

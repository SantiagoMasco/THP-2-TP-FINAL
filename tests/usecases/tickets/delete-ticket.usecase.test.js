const { DeleteTicketUseCase } = require("../../../src/usecases/tickets/delete-ticket.usecase");

describe("DeleteTicketUseCase", () => {
  let usecase;
  let mockRepos;

  beforeEach(() => {
    mockRepos = {
      tickets: {
        findById: jest.fn(),
        delete: jest.fn()
      }
    };
    usecase = new DeleteTicketUseCase(mockRepos);
  });

  it("elimina ticket existente (borrado duro)", async () => {
    const input = { id: 1 };
    const existingTicket = {
      id: 1,
      title: "Test Ticket",
      status: "open"
    };

    mockRepos.tickets.findById.mockResolvedValue(existingTicket);
    mockRepos.tickets.delete.mockResolvedValue({ success: true });

    const result = await usecase.apply(input);

    expect(mockRepos.tickets.findById).toHaveBeenCalledWith(1);
    expect(mockRepos.tickets.delete).toHaveBeenCalledWith(1);
    expect(result).toEqual({ success: true });
  });

  it("falla cuando ticket no existe", async () => {
    const input = { id: 999 };

    mockRepos.tickets.findById.mockResolvedValue(null);

    await expect(usecase.apply(input)).rejects.toThrow("Ticket not found");
    expect(mockRepos.tickets.delete).not.toHaveBeenCalled();
  });
});

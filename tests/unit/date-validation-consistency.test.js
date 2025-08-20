const { ListTicketsUseCase } = require("../../src/usecases/tickets/list-tickets.usecase");
const { CountByStatusUseCase } = require("../../src/usecases/stats/count-by-status.usecase");

describe("Date Validation Consistency", () => {
  let mockRepos;

  beforeEach(() => {
    mockRepos = {
      tickets: {
        findMany: jest.fn(),
        count: jest.fn(),
        countByStatus: jest.fn()
      }
    };
  });

  describe("Both use cases reject invalid dates consistently", () => {
    it("ListTicketsUseCase rejects invalid from date", async () => {
      const usecase = new ListTicketsUseCase(mockRepos);
      
      await expect(usecase.apply({
        from: "invalid-date"
      })).rejects.toThrow("Invalid date format");
    });

    it("ListTicketsUseCase rejects invalid to date", async () => {
      const usecase = new ListTicketsUseCase(mockRepos);
      
      await expect(usecase.apply({
        to: "not-a-date"
      })).rejects.toThrow("Invalid date format");
    });

    it("CountByStatusUseCase rejects invalid from date", async () => {
      const usecase = new CountByStatusUseCase(mockRepos);
      
      await expect(usecase.apply({
        from: "invalid-date"
      })).rejects.toThrow("Invalid date format");
    });

    it("CountByStatusUseCase rejects invalid to date", async () => {
      const usecase = new CountByStatusUseCase(mockRepos);
      
      await expect(usecase.apply({
        to: "not-a-date"  
      })).rejects.toThrow("Invalid date format");
    });

    it("Both use cases accept valid dates without throwing", async () => {
      const listUseCase = new ListTicketsUseCase(mockRepos);
      const countUseCase = new CountByStatusUseCase(mockRepos);
      
      mockRepos.tickets.findMany.mockResolvedValue([]);
      mockRepos.tickets.count.mockResolvedValue(0);
      mockRepos.tickets.countByStatus.mockResolvedValue({});

      const validInput = {
        from: "2024-01-01",
        to: "2024-12-31"
      };

      // Ninguno debería lanzar error
      await expect(listUseCase.apply(validInput)).resolves.toBeDefined();
      await expect(countUseCase.apply(validInput)).resolves.toBeDefined();
    });

    it("Both use cases handle missing dates gracefully", async () => {
      const listUseCase = new ListTicketsUseCase(mockRepos);
      const countUseCase = new CountByStatusUseCase(mockRepos);
      
      mockRepos.tickets.findMany.mockResolvedValue([]);
      mockRepos.tickets.count.mockResolvedValue(0);
      mockRepos.tickets.countByStatus.mockResolvedValue({});

      const inputWithoutDates = { status: "open" };

      // Ambos deberían funcionar sin fechas
      await expect(listUseCase.apply(inputWithoutDates)).resolves.toBeDefined();
      await expect(countUseCase.apply(inputWithoutDates)).resolves.toBeDefined();
    });
  });
  
  describe("Error messages are identical", () => {
    it("Both use cases throw identical error message for invalid dates", async () => {
      const listUseCase = new ListTicketsUseCase(mockRepos);
      const countUseCase = new CountByStatusUseCase(mockRepos);
      
      let listError, countError;
      
      try {
        await listUseCase.apply({ from: "invalid" });
      } catch (error) {
        listError = error.message;
      }
      
      try {
        await countUseCase.apply({ from: "invalid" });
      } catch (error) {
        countError = error.message;
      }
      
      expect(listError).toBe(countError);
      expect(listError).toBe("Invalid date format");
    });
  });
});

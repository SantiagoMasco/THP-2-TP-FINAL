const { CountByStatusUseCase } = require("../../../src/usecases/stats/count-by-status.usecase");

describe("CountByStatusUseCase", () => {
  let usecase;
  let mockRepos;

  beforeEach(() => {
    mockRepos = {
      tickets: {
        countByStatus: jest.fn()
      }
    };
    usecase = new CountByStatusUseCase(mockRepos);
  });

  it("cuenta tickets por status sin filtros de fecha", async () => {
    const input = {};
    const mockCounts = {
      open: 5,
      in_progress: 3,
      resolved: 8,
      closed: 2
    };

    mockRepos.tickets.countByStatus.mockResolvedValue(mockCounts);

    const result = await usecase.apply(input);

    expect(mockRepos.tickets.countByStatus).toHaveBeenCalledWith({});
    expect(result).toEqual({
      from: null,
      to: null,
      counts: mockCounts
    });
  });

  it("cuenta tickets por status con rango de fechas", async () => {
    const input = {
      from: "2024-01-01",
      to: "2024-01-31"
    };
    const mockCounts = {
      open: 2,
      in_progress: 1,
      resolved: 4,
      closed: 1
    };

    mockRepos.tickets.countByStatus.mockResolvedValue(mockCounts);

    const result = await usecase.apply(input);

    const expectedWhere = {
      createdAt: {
        gte: new Date("2024-01-01"),
        lte: new Date("2024-01-31")
      }
    };

    expect(mockRepos.tickets.countByStatus).toHaveBeenCalledWith(expectedWhere);
    expect(result).toEqual({
      from: "2024-01-01",
      to: "2024-01-31",
      counts: mockCounts
    });
  });

  it("cuenta tickets con solo fecha desde", async () => {
    const input = {
      from: "2024-01-01"
    };
    const mockCounts = {
      open: 3,
      in_progress: 2,
      resolved: 1,
      closed: 0
    };

    mockRepos.tickets.countByStatus.mockResolvedValue(mockCounts);

    const result = await usecase.apply(input);

    const expectedWhere = {
      createdAt: {
        gte: new Date("2024-01-01")
      }
    };

    expect(mockRepos.tickets.countByStatus).toHaveBeenCalledWith(expectedWhere);
    expect(result).toEqual({
      from: "2024-01-01",
      to: null,
      counts: mockCounts
    });
  });

  it("cuenta tickets con solo fecha hasta", async () => {
    const input = {
      to: "2024-01-31"
    };
    const mockCounts = {
      open: 1,
      in_progress: 0,
      resolved: 2,
      closed: 3
    };

    mockRepos.tickets.countByStatus.mockResolvedValue(mockCounts);

    const result = await usecase.apply(input);

    const expectedWhere = {
      createdAt: {
        lte: new Date("2024-01-31")
      }
    };

    expect(mockRepos.tickets.countByStatus).toHaveBeenCalledWith(expectedWhere);
    expect(result).toEqual({
      from: null,
      to: "2024-01-31",
      counts: mockCounts
    });
  });

  it("incluye estados con count 0 si no existen", async () => {
    const input = {};
    const mockCounts = {
      open: 3,
      resolved: 1
      // in_progress y closed missing
    };

    mockRepos.tickets.countByStatus.mockResolvedValue(mockCounts);

    const result = await usecase.apply(input);

    expect(result.counts).toEqual({
      open: 3,
      in_progress: 0,
      resolved: 1,
      closed: 0
    });
  });

  it("valida formato de fechas", async () => {
    const input = {
      from: "invalid-date",
      to: "2024-01-31"
    };

    await expect(usecase.apply(input)).rejects.toThrow("Invalid date format");
  });
});

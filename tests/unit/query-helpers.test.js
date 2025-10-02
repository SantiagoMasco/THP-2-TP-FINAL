const {
  buildDateRange,
  buildPagination,
  applyDateFilter
} = require("../../src/utils/query-helpers");

describe("Query Helpers", () => {
  describe("buildDateRange", () => {
    it("retorna null cuando no hay fechas", () => {
      expect(buildDateRange({})).toBeNull();
      expect(buildDateRange({ from: null, to: null })).toBeNull();
      expect(buildDateRange({ from: undefined, to: undefined })).toBeNull();
    });

    it("construye rango solo con fecha desde", () => {
      const result = buildDateRange({ from: "2024-01-01" });
      
      expect(result).toEqual({
        gte: new Date("2024-01-01")
      });
    });

    it("construye rango solo con fecha hasta", () => {
      const result = buildDateRange({ to: "2024-12-31" });
      
      expect(result).toEqual({
        lte: new Date("2024-12-31")
      });
    });

    it("construye rango completo con ambas fechas", () => {
      const result = buildDateRange({
        from: "2024-01-01",
        to: "2024-12-31"
      });
      
      expect(result).toEqual({
        gte: new Date("2024-01-01"),
        lte: new Date("2024-12-31")
      });
    });

    it("lanza error para fecha desde inválida", () => {
      expect(() => buildDateRange({ from: "invalid-date" }))
        .toThrow("Invalid date format");
      
      expect(() => buildDateRange({ from: "2024-13-45" }))
        .toThrow("Invalid date format");
    });

    it("lanza error para fecha hasta inválida", () => {
      expect(() => buildDateRange({ to: "not-a-date" }))
        .toThrow("Invalid date format");
      
      expect(() => buildDateRange({ to: "2024/02/30" }))
        .toThrow("Invalid date format");
    });

    it("lanza error si cualquier fecha es inválida en rango completo", () => {
      expect(() => buildDateRange({
        from: "2024-01-01",
        to: "invalid"
      })).toThrow("Invalid date format");

      expect(() => buildDateRange({
        from: "invalid",
        to: "2024-12-31"
      })).toThrow("Invalid date format");
    });

    it("acepta formatos de fecha válidos", () => {
      const validFormats = [
        "2024-01-01",
        "2024-01-01T10:30:00",
        "2024-01-01T10:30:00Z",
        "2024-01-01T10:30:00.000Z"
      ];

      validFormats.forEach(format => {
        expect(() => buildDateRange({ from: format })).not.toThrow();
      });
    });
  });

  describe("buildPagination", () => {
    it("construye paginación básica con defaults", () => {
      const result = buildPagination({});
      
      expect(result).toEqual({
        page: 1,
        pageSize: 20,
        skip: 0,
        take: 20
      });
    });

    it("usa pageSize personalizado", () => {
      const result = buildPagination({}, 10);
      
      expect(result).toEqual({
        page: 1,
        pageSize: 10,
        skip: 0,
        take: 10
      });
    });

    it("parsea página válida", () => {
      const result = buildPagination({ page: "3" }, 20);
      
      expect(result).toEqual({
        page: 3,
        pageSize: 20,
        skip: 40, // (3-1) * 20
        take: 20
      });
    });

    it("usa página 1 para valores inválidos", () => {
      const invalidValues = ["", null, undefined, "abc", "-1", "0"];
      
      invalidValues.forEach(value => {
        const result = buildPagination({ page: value });
        expect(result.page).toBe(1);
        expect(result.skip).toBe(0);
      });
    });

    it("garantiza página mínima de 1", () => {
      const result = buildPagination({ page: "-5" });
      
      expect(result.page).toBe(1);
      expect(result.skip).toBe(0);
    });

    it("calcula skip correctamente para páginas altas", () => {
      const result = buildPagination({ page: "5" }, 15);
      
      expect(result).toEqual({
        page: 5,
        pageSize: 15,
        skip: 60, // (5-1) * 15
        take: 15
      });
    });

    it("maneja números enteros directamente", () => {
      const result = buildPagination({ page: 4 }, 25);
      
      expect(result.page).toBe(4);
      expect(result.skip).toBe(75);
    });
  });

  describe("applyDateFilter", () => {
    it("no modifica where cuando no hay fechas", () => {
      const where = { status: "open" };
      applyDateFilter(where, {});
      
      expect(where).toEqual({ status: "open" });
    });

    it("agrega filtro de fecha al where", () => {
      const where = { status: "open" };
      applyDateFilter(where, {
        from: "2024-01-01",
        to: "2024-12-31"
      });
      
      expect(where).toEqual({
        status: "open",
        createdAt: {
          gte: new Date("2024-01-01"),
          lte: new Date("2024-12-31")
        }
      });
    });

    it("usa campo personalizado", () => {
      const where = {};
      applyDateFilter(where, { from: "2024-01-01" }, "updatedAt");
      
      expect(where).toEqual({
        updatedAt: {
          gte: new Date("2024-01-01")
        }
      });
    });

    it("propaga errores de validación de fechas", () => {
      const where = {};
      
      expect(() => applyDateFilter(where, { from: "invalid" }))
        .toThrow("Invalid date format");
    });

    it("maneja fechas parciales", () => {
      const where1 = {};
      const where2 = {};
      
      applyDateFilter(where1, { from: "2024-01-01" });
      applyDateFilter(where2, { to: "2024-12-31" });
      
      expect(where1.createdAt).toEqual({ gte: new Date("2024-01-01") });
      expect(where2.createdAt).toEqual({ lte: new Date("2024-12-31") });
    });

    it("no sobrescribe otros campos del where", () => {
      const where = {
        status: "open",
        priority: "high",
        assignedUserId: 5
      };
      
      applyDateFilter(where, { from: "2024-01-01" });
      
      expect(where.status).toBe("open");
      expect(where.priority).toBe("high");
      expect(where.assignedUserId).toBe(5);
      expect(where.createdAt).toEqual({ gte: new Date("2024-01-01") });
    });
  });
});

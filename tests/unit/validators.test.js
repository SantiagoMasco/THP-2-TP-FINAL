const {
  validateId,
  validateRole,
  validatePriority,
  validateStatus,
  validateScope,
  parsePage,
  parsePageSize,
  validateRequiredString,
  validateOptionalNumber,
  validateOptionalBoolean
} = require("../../src/utils/validators");

describe("Validators", () => {
  describe("validateId", () => {
    it("validates valid integer IDs", () => {
      expect(validateId("123")).toBe(123);
      expect(validateId(456)).toBe(456);
      expect(validateId("1")).toBe(1);
    });

    it("throws error for invalid IDs", () => {
      expect(() => validateId(null)).toThrow("Valid id is required");
      expect(() => validateId("")).toThrow("Valid id is required");
      expect(() => validateId("abc")).toThrow("Valid id is required");
      expect(() => validateId(undefined)).toThrow("Valid id is required");
    });

    it("customizes error message with fieldName", () => {
      expect(() => validateId("invalid", "userId")).toThrow("Valid UserId is required");
      expect(() => validateId(null, "ticketId")).toThrow("Valid TicketId is required");
    });
  });

  describe("validateRole", () => {
    it("accepts valid roles", () => {
      expect(() => validateRole("admin")).not.toThrow();
      expect(() => validateRole("agent")).not.toThrow();
      expect(() => validateRole("customer")).not.toThrow();
      expect(() => validateRole(undefined)).not.toThrow(); // undefined is allowed
    });

    it("throws error for invalid roles", () => {
      expect(() => validateRole("invalid")).toThrow("Role must be admin, agent, customer");
      expect(() => validateRole("user")).toThrow("Role must be admin, agent, customer");
      expect(() => validateRole("")).toThrow("Role must be admin, agent, customer");
    });
  });

  describe("validatePriority", () => {
    it("accepts valid priorities", () => {
      expect(() => validatePriority("low")).not.toThrow();
      expect(() => validatePriority("med")).not.toThrow();
      expect(() => validatePriority("high")).not.toThrow();
      expect(() => validatePriority(undefined)).not.toThrow(); // undefined is allowed
    });

    it("throws error for invalid priorities", () => {
      expect(() => validatePriority("invalid")).toThrow("Priority must be low, med, high");
      expect(() => validatePriority("medium")).toThrow("Priority must be low, med, high");
      expect(() => validatePriority("")).toThrow("Priority must be low, med, high");
    });
  });

  describe("validateStatus", () => {
    it("accepts valid statuses", () => {
      expect(() => validateStatus("open")).not.toThrow();
      expect(() => validateStatus("in_progress")).not.toThrow();
      expect(() => validateStatus("resolved")).not.toThrow();
      expect(() => validateStatus("closed")).not.toThrow();
      expect(() => validateStatus(undefined)).not.toThrow(); // undefined is allowed
    });

    it("throws error for invalid statuses", () => {
      expect(() => validateStatus("invalid")).toThrow("Status must be open, in_progress, resolved, closed");
      expect(() => validateStatus("pending")).toThrow("Status must be open, in_progress, resolved, closed");
      expect(() => validateStatus("")).toThrow("Status must be open, in_progress, resolved, closed");
    });
  });

  describe("validateScope", () => {
    it("accepts valid scopes", () => {
      expect(validateScope("assigned")).toBe("assigned");
      expect(validateScope("created")).toBe("created");
      expect(() => validateScope(undefined)).not.toThrow(); // undefined is allowed
    });

    it("throws error for invalid scopes", () => {
      expect(() => validateScope("invalid")).toThrow("Scope must be assigned or created");
      expect(() => validateScope("all")).toThrow("Scope must be assigned or created");
      expect(() => validateScope("")).toThrow("Scope must be assigned or created");
    });
  });

  describe("parsePage", () => {
    it("parses valid page numbers", () => {
      expect(parsePage("1")).toBe(1);
      expect(parsePage("5")).toBe(5);
      expect(parsePage(10)).toBe(10);
    });

    it("defaults to 1 for invalid values", () => {
      expect(parsePage("")).toBe(1);
      expect(parsePage(null)).toBe(1);
      expect(parsePage(undefined)).toBe(1);
      expect(parsePage("abc")).toBe(1);
    });

    it("enforces minimum value of 1", () => {
      expect(parsePage("0")).toBe(1);
      expect(parsePage("-1")).toBe(1);
      expect(parsePage(-5)).toBe(1);
    });
  });

  describe("parsePageSize", () => {
    it("parses valid page sizes", () => {
      expect(parsePageSize("10")).toBe(10);
      expect(parsePageSize("25")).toBe(25);
      expect(parsePageSize(15)).toBe(15);
    });

    it("uses default when invalid", () => {
      expect(parsePageSize("")).toBe(20);
      expect(parsePageSize(null)).toBe(20);
      expect(parsePageSize(undefined)).toBe(20);
      expect(parsePageSize("abc")).toBe(20);
    });

    it("respects custom defaults", () => {
      expect(parsePageSize("", 10)).toBe(10);
      expect(parsePageSize(null, 15)).toBe(15);
    });

    it("enforces maximum size", () => {
      expect(parsePageSize("100", 20, 50)).toBe(50);
      expect(parsePageSize("200", 20, 50)).toBe(50);
    });

    it("enforces minimum of 1", () => {
      expect(parsePageSize("0")).toBe(1);
      expect(parsePageSize("-5")).toBe(1);
    });
  });

  describe("validateRequiredString", () => {
    it("accepts valid strings", () => {
      expect(() => validateRequiredString("hello", "name")).not.toThrow();
      expect(() => validateRequiredString("  ", "title")).not.toThrow(); // whitespace is valid
    });

    it("throws error for invalid strings", () => {
      expect(() => validateRequiredString(null, "name")).toThrow("Name is required and must be a string");
      expect(() => validateRequiredString("", "title")).toThrow("Title is required and must be a string");
      expect(() => validateRequiredString(123, "description")).toThrow("Description is required and must be a string");
      expect(() => validateRequiredString(undefined, "field")).toThrow("Field is required and must be a string");
    });
  });

  describe("validateOptionalNumber", () => {
    it("accepts valid numbers", () => {
      expect(() => validateOptionalNumber("123", "count")).not.toThrow();
      expect(() => validateOptionalNumber(456, "size")).not.toThrow();
      expect(() => validateOptionalNumber("0", "minimum")).not.toThrow();
      expect(() => validateOptionalNumber(undefined, "optional")).not.toThrow(); // undefined is allowed
      expect(() => validateOptionalNumber(null, "nullable")).not.toThrow(); // null is allowed
    });

    it("throws error for invalid numbers", () => {
      expect(() => validateOptionalNumber("abc", "count")).toThrow("Count must be a number");
      expect(() => validateOptionalNumber("12.5.6", "amount")).toThrow("Amount must be a number");
      expect(() => validateOptionalNumber({}, "id")).toThrow("Id must be a number");
    });
  });

  describe("validateOptionalBoolean", () => {
    it("accepts valid booleans", () => {
      expect(() => validateOptionalBoolean(true, "active")).not.toThrow();
      expect(() => validateOptionalBoolean(false, "enabled")).not.toThrow();
      expect(() => validateOptionalBoolean(undefined, "optional")).not.toThrow(); // undefined is allowed
    });

    it("throws error for invalid booleans", () => {
      expect(() => validateOptionalBoolean("true", "active")).toThrow("Active must be a boolean");
      expect(() => validateOptionalBoolean(1, "enabled")).toThrow("Enabled must be a boolean");
      expect(() => validateOptionalBoolean("false", "flag")).toThrow("Flag must be a boolean");
      expect(() => validateOptionalBoolean(null, "setting")).toThrow("Setting must be a boolean");
    });
  });
});

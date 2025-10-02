const {
  TICKET_STATUS,
  TICKET_PRIORITY,
  USER_ROLE,
  TICKET_SCOPE,
  VALID_TICKET_STATUSES,
  VALID_TICKET_PRIORITIES,
  VALID_USER_ROLES,
  VALID_TICKET_SCOPES,
  DEFAULT_TICKET_STATUS,
  DEFAULT_TICKET_PRIORITY,
  DEFAULT_USER_ROLE,
  DEFAULT_TICKET_SCOPE
} = require("../../src/constants/enums");

describe("Enums", () => {
  describe("TICKET_STATUS", () => {
    it("has expected status values", () => {
      expect(TICKET_STATUS.OPEN).toBe('open');
      expect(TICKET_STATUS.IN_PROGRESS).toBe('in_progress');
      expect(TICKET_STATUS.RESOLVED).toBe('resolved');
      expect(TICKET_STATUS.CLOSED).toBe('closed');
    });
  });

  describe("TICKET_PRIORITY", () => {
    it("has expected priority values", () => {
      expect(TICKET_PRIORITY.LOW).toBe('low');
      expect(TICKET_PRIORITY.MEDIUM).toBe('med');
      expect(TICKET_PRIORITY.HIGH).toBe('high');
    });
  });

  describe("USER_ROLE", () => {
    it("has expected role values", () => {
      expect(USER_ROLE.ADMIN).toBe('admin');
      expect(USER_ROLE.AGENT).toBe('agent');
      expect(USER_ROLE.CUSTOMER).toBe('customer');
    });
  });

  describe("TICKET_SCOPE", () => {
    it("has expected scope values", () => {
      expect(TICKET_SCOPE.ASSIGNED).toBe('assigned');
      expect(TICKET_SCOPE.CREATED).toBe('created');
    });
  });

  describe("Valid arrays", () => {
    it("VALID_TICKET_STATUSES contains all statuses", () => {
      expect(VALID_TICKET_STATUSES).toEqual(['open', 'in_progress', 'resolved', 'closed']);
      expect(VALID_TICKET_STATUSES.length).toBe(4);
    });

    it("VALID_TICKET_PRIORITIES contains all priorities", () => {
      expect(VALID_TICKET_PRIORITIES).toEqual(['low', 'med', 'high']);
      expect(VALID_TICKET_PRIORITIES.length).toBe(3);
    });

    it("VALID_USER_ROLES contains all roles", () => {
      expect(VALID_USER_ROLES).toEqual(['admin', 'agent', 'customer']);
      expect(VALID_USER_ROLES.length).toBe(3);
    });

    it("VALID_TICKET_SCOPES contains all scopes", () => {
      expect(VALID_TICKET_SCOPES).toEqual(['assigned', 'created']);
      expect(VALID_TICKET_SCOPES.length).toBe(2);
    });
  });

  describe("Default values", () => {
    it("has correct default values", () => {
      expect(DEFAULT_TICKET_STATUS).toBe('open');
      expect(DEFAULT_TICKET_PRIORITY).toBe('med');
      expect(DEFAULT_USER_ROLE).toBe('customer');
      expect(DEFAULT_TICKET_SCOPE).toBe('assigned');
    });

    it("defaults are included in valid arrays", () => {
      expect(VALID_TICKET_STATUSES).toContain(DEFAULT_TICKET_STATUS);
      expect(VALID_TICKET_PRIORITIES).toContain(DEFAULT_TICKET_PRIORITY);
      expect(VALID_USER_ROLES).toContain(DEFAULT_USER_ROLE);
      expect(VALID_TICKET_SCOPES).toContain(DEFAULT_TICKET_SCOPE);
    });
  });
});

const { parsePagination } = require("../../src/utils/pagination");

describe("parsePagination", () => {
  it("usa default y max de config", () => {
    const { page, pageSize, skip, take } = parsePagination({});
    expect(page).toBe(1);
    expect(pageSize).toBeGreaterThan(0);
    expect(skip).toBe(0);
    expect(take).toBe(pageSize);
  });

  it("clamp del pageSize y cálculo de skip", () => {
    const { page, pageSize, skip } = parsePagination({ page: "3", pageSize: "999" });
    expect(page).toBe(3);
    expect(pageSize).toBeLessThanOrEqual(100);
    expect(skip).toBe((3 - 1) * pageSize);
  });
});

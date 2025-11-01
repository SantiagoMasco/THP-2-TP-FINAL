const { getConfig } = require("../../src/config");

describe("config YAML loader", () => {
  it("lee config.yaml y respeta valores", () => {
    const cfg = getConfig();
    expect(cfg.port).toBe(3000);
    expect(cfg.db.sqlite_path).toBe("./data/app.sqlite");
    expect(cfg.features.stats).toBe(true);
  });
});

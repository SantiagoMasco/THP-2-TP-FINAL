const request = require("supertest");
const app = require("../../src/app");

describe("ping & health", () => {
  it("/ping → pong", async () => {
    const r = await request(app).get("/ping");
    expect(r.status).toBe(200);
    expect(r.body.pong).toBe(true);
  });

  it("/health → ok y uptime number", async () => {
    const r = await request(app).get("/health");
    expect(r.status).toBe(200);
    expect(r.body.ok).toBe(true);
    expect(typeof r.body.uptime).toBe("number");
  });
});

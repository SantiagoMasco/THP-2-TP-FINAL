const request = require('supertest');
const app = require('../../src/app');

describe('CORS Integration - Real Endpoints', () => {
  const validOrigin = 'http://localhost:3000';

  it('GET /users funciona con CORS', async () => {
    const response = await request(app)
      .get('/users')
      .set('Origin', validOrigin)
      .expect('Content-Type', /json/);

    expect(response.headers['access-control-allow-origin']).toBe(validOrigin);
    expect(response.status).not.toBe(500);
  });

  it('POST /users funciona con CORS', async () => {
    const userData = {
      name: "Test User",
      email: "test@example.com",
      role: "customer"
    };

    const response = await request(app)
      .post('/users')
      .set('Origin', validOrigin)
      .send(userData)
      .expect('Content-Type', /json/);

    expect(response.headers['access-control-allow-origin']).toBe(validOrigin);
    // El endpoint puede fallar por otros motivos, pero no por CORS
    expect(response.status).not.toBe(500);
  });

  it('GET /tickets funciona con CORS', async () => {
    const response = await request(app)
      .get('/tickets')
      .set('Origin', validOrigin)
      .expect('Content-Type', /json/);

    expect(response.headers['access-control-allow-origin']).toBe(validOrigin);
    expect(response.status).not.toBe(500);
  });

  it('GET /users/:userId/tickets funciona con CORS', async () => {
    const response = await request(app)
      .get('/users/1/tickets')
      .set('Origin', validOrigin)
      .expect('Content-Type', /json/);

    expect(response.headers['access-control-allow-origin']).toBe(validOrigin);
    expect(response.status).not.toBe(500);
  });

  it('todos los endpoints mantienen estructura de respuesta con CORS', async () => {
    const endpoints = [
      '/ping',
      '/health', 
      '/users',
      '/tickets',
      '/stats'
    ];

    for (const endpoint of endpoints) {
      const response = await request(app)
        .get(endpoint)
        .set('Origin', validOrigin);

      expect(response.headers['access-control-allow-origin']).toBe(validOrigin);
      expect(response.status).not.toBe(500);
    }
  });
});

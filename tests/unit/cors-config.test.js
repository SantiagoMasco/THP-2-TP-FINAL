const request = require('supertest');
const app = require('../../src/app');

describe('CORS Configuration', () => {
  it('permite requests desde origins permitidos por defecto', async () => {
    const response = await request(app)
      .get('/ping')
      .set('Origin', 'http://localhost:3000')
      .expect(200);
      
    expect(response.headers['access-control-allow-origin']).toBe('http://localhost:3000');
    expect(response.headers['access-control-allow-credentials']).toBe('true');
  });

  it('permite requests sin origin (mobile/curl)', async () => {
    await request(app)
      .get('/ping')
      .expect(200);
  });

  it('rechaza origins no permitidos', async () => {
    await request(app)
      .get('/ping')
      .set('Origin', 'https://malicious-site.com')
      .expect(500); // Error de CORS
  });

  it('maneja preflight OPTIONS requests correctamente', async () => {
    const response = await request(app)
      .options('/users')
      .set('Origin', 'http://localhost:3001')
      .set('Access-Control-Request-Method', 'POST')
      .set('Access-Control-Request-Headers', 'Content-Type')
      .expect(204);

    expect(response.headers['access-control-allow-methods']).toContain('POST');
    expect(response.headers['access-control-allow-headers']).toContain('Content-Type');
  });

  it('permite headers Authorization para autenticación', async () => {
    const response = await request(app)
      .options('/tickets')
      .set('Origin', 'http://localhost:3000')
      .set('Access-Control-Request-Headers', 'Authorization')
      .expect(204);

    expect(response.headers['access-control-allow-headers']).toContain('Authorization');
  });
});

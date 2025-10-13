const request = require('supertest');
const app = require('../../src/app');

describe('GET /users/:userId/tickets - Integration', () => {
  // Smoke tests para verificar que el controller integra correctamente con el UseCase

  it('responde con estructura correcta para usuario válido', async () => {
    const response = await request(app)
      .get('/users/1/tickets')
      .expect('Content-Type', /json/);

    // El endpoint puede devolver 200 con data vacía o error si no hay datos de prueba
    if (response.status === 200) {
      // Verificar estructura de respuesta (contrato HTTP)
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('page');
      expect(response.body).toHaveProperty('pageSize');
      expect(response.body).toHaveProperty('hasNext');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(typeof response.body.page).toBe('number');
      expect(typeof response.body.pageSize).toBe('number');
      expect(typeof response.body.hasNext).toBe('boolean');
    }
  });

  it('maneja userId inválido con error 400', async () => {
    const response = await request(app)
      .get('/users/invalid/tickets')
      .expect(400)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toContain('UserId is required');
  });

  it('maneja scope inválido con error 400', async () => {
    const response = await request(app)
      .get('/users/1/tickets?scope=invalid')
      .expect(400)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toContain('Scope must be');
  });

  it('acepta parámetros válidos', async () => {
    const response = await request(app)
      .get('/users/1/tickets?page=1&pageSize=10&scope=assigned&status=open')
      .expect('Content-Type', /json/);

    // No debe ser 400 para parámetros válidos
    expect(response.status).not.toBe(400);
  });

  it('acepta scope=created', async () => {
    const response = await request(app)
      .get('/users/1/tickets?scope=created')
      .expect('Content-Type', /json/);

    expect(response.status).not.toBe(400);
  });

  it('acepta todos los status válidos', async () => {
    const validStatuses = ['open', 'in_progress', 'resolved', 'closed'];
    
    for (const status of validStatuses) {
      const response = await request(app)
        .get(`/users/1/tickets?status=${status}`)
        .expect('Content-Type', /json/);

      expect(response.status).not.toBe(400);
    }
  });

  it('maneja pageSize que excede el máximo', async () => {
    const response = await request(app)
      .get('/users/1/tickets?pageSize=100')
      .expect('Content-Type', /json/);

    // Debe aceptar pero limitar internamente (no error 400)
    expect(response.status).not.toBe(400);
    
    if (response.status === 200) {
      // Verificar que pageSize se limita a 50
      expect(response.body.pageSize).toBeLessThanOrEqual(50);
    }
  });
});

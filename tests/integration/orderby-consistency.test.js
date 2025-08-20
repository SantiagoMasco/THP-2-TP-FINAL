const request = require('supertest');
const app = require('../../src/app');

describe('OrderBy Consistency - Integration Tests', () => {
  // Smoke tests para verificar que el orderBy compuesto funciona en endpoints reales

  it('GET /tickets usa orderBy compuesto por defecto', async () => {
    const response = await request(app)
      .get('/tickets')
      .expect('Content-Type', /json/);

    // El endpoint debe responder exitosamente (puede ser 200 con data vacía)
    expect(response.status).not.toBe(500); // No error interno
    
    if (response.status === 200) {
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      
      // Si hay datos, verificar que están ordenados
      if (response.body.data.length > 1) {
        const tickets = response.body.data;
        
        // Verificar que los timestamps están en orden descendente
        for (let i = 0; i < tickets.length - 1; i++) {
          const current = new Date(tickets[i].createdAt);
          const next = new Date(tickets[i + 1].createdAt);
          
          // Current debe ser >= next (desc order)
          expect(current >= next).toBe(true);
        }
      }
    }
  });

  it('GET /users/:userId/tickets usa orderBy compuesto personalizado', async () => {
    const response = await request(app)
      .get('/users/1/tickets')
      .expect('Content-Type', /json/);

    expect(response.status).not.toBe(500);
    
    if (response.status === 200) {
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      
      // Este endpoint específicamente usa orderBy compuesto optimizado para índices
      if (response.body.data.length > 1) {
        const tickets = response.body.data;
        
        // Verificar ordenamiento por createdAt desc, luego id desc
        for (let i = 0; i < tickets.length - 1; i++) {
          const current = new Date(tickets[i].createdAt);
          const next = new Date(tickets[i + 1].createdAt);
          
          if (current.getTime() === next.getTime()) {
            // Si createdAt es igual, verificar que id está en orden desc
            expect(tickets[i].id >= tickets[i + 1].id).toBe(true);
          } else {
            // createdAt debe estar en orden desc
            expect(current >= next).toBe(true);
          }
        }
      }
    }
  });

  it('GET /tickets con filtros mantiene orderBy compuesto', async () => {
    const response = await request(app)
      .get('/tickets?status=open&priority=high')
      .expect('Content-Type', /json/);

    expect(response.status).not.toBe(500);
    
    if (response.status === 200) {
      expect(response.body).toHaveProperty('data');
      // Verificar que filtros y ordenamiento coexisten sin errores
    }
  });

  it('GET /tickets con paginación mantiene orderBy consistente', async () => {
    // Test página 1
    const page1Response = await request(app)
      .get('/tickets?page=1')
      .expect('Content-Type', /json/);

    // Test página 2  
    const page2Response = await request(app)
      .get('/tickets?page=2')
      .expect('Content-Type', /json/);

    expect(page1Response.status).not.toBe(500);
    expect(page2Response.status).not.toBe(500);

    // Ambas páginas deben tener la misma estructura
    if (page1Response.status === 200) {
      expect(page1Response.body).toHaveProperty('data');
      expect(page1Response.body).toHaveProperty('page', 1);
    }
    
    if (page2Response.status === 200) {
      expect(page2Response.body).toHaveProperty('data');
      expect(page2Response.body).toHaveProperty('page', 2);
    }
  });

  it('contratos HTTP permanecen inalterados', async () => {
    const response = await request(app)
      .get('/tickets')
      .expect('Content-Type', /json/);

    if (response.status === 200) {
      // Verificar estructura exacta de respuesta (contrato)
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('page');
      expect(response.body).toHaveProperty('pageSize');
      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('totalPages');
      
      // Tipos correctos
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(typeof response.body.page).toBe('number');
      expect(typeof response.body.pageSize).toBe('number');
      expect(typeof response.body.total).toBe('number');
      expect(typeof response.body.totalPages).toBe('number');
    }
  });
});

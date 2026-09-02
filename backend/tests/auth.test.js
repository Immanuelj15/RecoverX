const request = require('supertest');
const app = require('../src/app');

describe('Phase 23: Merchant Authentication & JWT Test Suite', () => {
  let server;
  let validToken;

  beforeAll((done) => {
    server = app.listen(0, () => done());
  });

  afterAll((done) => {
    server.close(done);
  });

  test('POST /api/v1/auth/login returns 400 if email or password is missing', async () => {
    const response = await request(server)
      .post('/api/v1/auth/login')
      .send({ email: 'demo@recoverx.ai' });

    expect(response.status).toBe(400);
    expect(response.body.status).toBe('error');
  });

  test('POST /api/v1/auth/login returns 401 for incorrect password', async () => {
    const response = await request(server)
      .post('/api/v1/auth/login')
      .send({ email: 'demo@recoverx.ai', password: 'wrongpassword' });

    expect(response.status).toBe(401);
    expect(response.body.status).toBe('error');
    expect(response.body.message).toMatch(/invalid email or password/i);
  });

  test('POST /api/v1/auth/login returns 200 and signed JWT for valid credentials', async () => {
    const response = await request(server)
      .post('/api/v1/auth/login')
      .send({ email: 'demo@recoverx.ai', password: 'demo-password' });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.token).toBeDefined();
    expect(response.body.user).toBeDefined();
    expect(response.body.user.email).toBe('demo@recoverx.ai');
    expect(response.body.user.role).toBe('MERCHANT_ADMIN');

    validToken = response.body.token;
  });

  test('GET /api/v1/auth/me returns 401 if no Authorization header provided', async () => {
    const response = await request(server).get('/api/v1/auth/me');

    expect(response.status).toBe(401);
    expect(response.body.status).toBe('error');
  });

  test('GET /api/v1/auth/me returns user profile for valid Bearer token', async () => {
    const response = await request(server)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${validToken}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.user).toBeDefined();
    expect(response.body.user.email).toBe('demo@recoverx.ai');
  });

  test('POST /api/v1/auth/logout returns 200 success', async () => {
    const response = await request(server).post('/api/v1/auth/logout');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
  });
});

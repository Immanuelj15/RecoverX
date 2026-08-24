const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const { connectDB, disconnectDB, getConnectionStatus } = require('../src/config/db');
const { validateEnv } = require('../src/config/env');

describe('Phase 1: Project + Git + MongoDB Foundation Tests', () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await connectDB(uri);
  }, 60000);

  afterAll(async () => {
    await disconnectDB();
    if (mongoServer) {
      await mongoServer.stop();
    }
  });

  test('Environment validator parses config without errors', () => {
    const envConfig = validateEnv();
    expect(envConfig).toHaveProperty('PORT');
    expect(envConfig).toHaveProperty('MONGODB_URI');
  });

  test('MongoDB connects successfully and reports connected status (1)', () => {
    const status = getConnectionStatus();
    expect(status).toBe(1); // 1 = connected
  });

  test('GET /health returns 200 UP status with active DB connection info', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual('UP');
    expect(res.body.service).toEqual('recoverx-backend');
    expect(res.body.database.state).toEqual('connected');
    expect(res.body.database.readyState).toEqual(1);
  });
});

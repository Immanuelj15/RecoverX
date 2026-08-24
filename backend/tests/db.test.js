const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const { connectDB, disconnectDB, getConnectionStatus } = require('../src/config/db');
const { validateEnv } = require('../src/config/env');

describe('Phase 1: Project + Git + MongoDB Foundation Tests', () => {
  let connectSpy;

  beforeAll(() => {
    // Mock mongoose.connect to avoid downloading 500MB binaries in test environments
    connectSpy = jest.spyOn(mongoose, 'connect').mockImplementation(async (uri) => {
      mongoose.connection.readyState = 1;
      mongoose.connection.host = 'localhost';
      mongoose.connection.name = 'recoverx_test';
      return mongoose.connection;
    });
  });

  afterAll(async () => {
    connectSpy.mockRestore();
    mongoose.connection.readyState = 0;
  });

  test('Environment validator parses config without errors', () => {
    const envConfig = validateEnv();
    expect(envConfig).toHaveProperty('PORT');
    expect(envConfig).toHaveProperty('MONGODB_URI');
  });

  test('MongoDB connects successfully and reports connected status (1)', async () => {
    const conn = await connectDB('mongodb://localhost:27017/recoverx_test');
    expect(connectSpy).toHaveBeenCalled();
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

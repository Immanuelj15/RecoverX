const path = require('path');
const mongoose = require('mongoose');
const { transformCsvRowToTransaction, parseCsvFile } = require('../src/utils/csvImporter');
const { seedDatabase } = require('../src/scripts/seed');
const { Transaction, PolicyConfig } = require('../src/models');

describe('Phase 4: Seed Data + 10K CSV Importer Tests', () => {
  let connectSpy;

  beforeAll(() => {
    connectSpy = jest.spyOn(mongoose, 'connect').mockImplementation(async () => {
      mongoose.connection.readyState = 1;
      return mongoose.connection;
    });

    jest.spyOn(Transaction, 'deleteMany').mockImplementation(async () => ({ deletedCount: 0 }));
    jest.spyOn(Transaction, 'insertMany').mockImplementation(async (docs) => docs);
    jest.spyOn(PolicyConfig, 'findOne').mockImplementation(async () => null);
    jest.spyOn(PolicyConfig, 'create').mockImplementation(async (doc) => doc);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('transformCsvRowToTransaction correctly maps CSV fields and types', () => {
    const rawRow = {
      payment_id: 'pay_001',
      customer_id: 'cust_001',
      amount_inr: '8499.50',
      currency: 'INR',
      payment_method: 'upi',
      payment_status: 'failed',
      failure_reason: 'insufficient_balance',
      previous_successes: '8',
      previous_failures: '1',
      retry_count: '0',
      customer_ltv_inr: '42000',
      subscription_status: 'active',
      recovered: '1',
      outcome: 'failed_recovered'
    };

    const transformed = transformCsvRowToTransaction(rawRow);

    expect(transformed.payment_id).toEqual('pay_001');
    expect(transformed.amount_inr).toEqual(8499.5);
    expect(transformed.previous_successes).toEqual(8);
    expect(transformed.recovered).toEqual(1);
    expect(transformed.amount_recovered).toEqual(8499.5);
    expect(transformed.recovery_state).toEqual('DETECTED');
  });

  test('parseCsvFile reads and parses dataset cleanly', async () => {
    const csvPath = path.resolve(__dirname, '../../data/raw/recoverx_revenue_recovery_dataset_10000.csv');
    const records = await parseCsvFile(csvPath);

    expect(records.length).toEqual(10000);
    expect(records[0]).toHaveProperty('payment_id');
    expect(records[0]).toHaveProperty('customer_id');
    expect(records[0]).toHaveProperty('amount_inr');
    expect(records[0]).toHaveProperty('failure_reason');
  }, 15000);

  test('seedDatabase initializes policy config and seeds transactions', async () => {
    const csvPath = path.resolve(__dirname, '../../data/raw/recoverx_revenue_recovery_dataset_10000.csv');
    const result = await seedDatabase(csvPath);

    expect(result.insertedCount).toEqual(10000);
    expect(result.totalCount).toEqual(10000);
  }, 15000);
});

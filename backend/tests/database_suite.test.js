const request = require('supertest');
const app = require('../src/app');
const { Transaction, AuditLog, PolicyConfig, WebhookEvent } = require('../src/models');
const { TransactionRepository, AuditLogRepository, PolicyRepository, WebhookRepository } = require('../src/repositories');

describe('Phase 10: Complete Database Layer Integration Test Suite', () => {
  test('All database schemas are compiled and accessible', () => {
    expect(Transaction.modelName).toEqual('Transaction');
    expect(AuditLog.modelName).toEqual('AuditLog');
    expect(PolicyConfig.modelName).toEqual('PolicyConfig');
    expect(WebhookEvent.modelName).toEqual('WebhookEvent');
  });

  test('All repository services export required methods', () => {
    expect(typeof TransactionRepository.findByPaymentId).toEqual('function');
    expect(typeof AuditLogRepository.createLog).toEqual('function');
    expect(typeof PolicyRepository.getGlobalPolicy).toEqual('function');
    expect(typeof WebhookRepository.saveEvent).toEqual('function');
  });
});

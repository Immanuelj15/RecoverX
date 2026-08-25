const {
  TransactionRepository,
  AuditLogRepository,
  PolicyRepository,
  WebhookRepository
} = require('../src/repositories');
const { Transaction, AuditLog, PolicyConfig, WebhookEvent } = require('../src/models');

describe('Phase 5: Repositories + Database Services Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('TransactionRepository', () => {
    test('findByPaymentId queries database by payment_id', async () => {
      const mockTxn = { payment_id: 'pay_123', amount_inr: 8499 };
      jest.spyOn(Transaction, 'findOne').mockResolvedValue(mockTxn);

      const res = await TransactionRepository.findByPaymentId('pay_123');
      expect(Transaction.findOne).toHaveBeenCalledWith({ payment_id: 'pay_123' });
      expect(res.payment_id).toEqual('pay_123');
    });

    test('updateState updates recovery state and timestamp', async () => {
      const mockUpdated = { payment_id: 'pay_123', recovery_state: 'ANALYZING' };
      jest.spyOn(Transaction, 'findOneAndUpdate').mockResolvedValue(mockUpdated);

      const res = await TransactionRepository.updateState('pay_123', 'ANALYZING');
      expect(Transaction.findOneAndUpdate).toHaveBeenCalled();
      expect(res.recovery_state).toEqual('ANALYZING');
    });
  });

  describe('AuditLogRepository', () => {
    test('findByPaymentId queries logs for payment_id sorted by timestamp', async () => {
      const mockLogs = [{ payment_id: 'pay_123', event_type: 'DETECTED' }];
      const mockChain = {
        sort: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockLogs)
      };
      jest.spyOn(AuditLog, 'find').mockReturnValue(mockChain);

      const res = await AuditLogRepository.findByPaymentId('pay_123');
      expect(AuditLog.find).toHaveBeenCalledWith({ payment_id: 'pay_123' });
      expect(res).toHaveLength(1);
    });
  });

  describe('PolicyRepository', () => {
    test('getGlobalPolicy fetches global_policy config', async () => {
      const mockPolicy = { key: 'global_policy', max_retry_count: 3 };
      jest.spyOn(PolicyConfig, 'findOne').mockResolvedValue(mockPolicy);

      const res = await PolicyRepository.getGlobalPolicy();
      expect(PolicyConfig.findOne).toHaveBeenCalledWith({ key: 'global_policy' });
      expect(res.max_retry_count).toEqual(3);
    });
  });

  describe('WebhookRepository', () => {
    test('markProcessed updates processing flag and timestamp', async () => {
      const mockEvent = { event_id: 'evt_123', processed: true };
      jest.spyOn(WebhookEvent, 'findOneAndUpdate').mockResolvedValue(mockEvent);

      const res = await WebhookRepository.markProcessed('evt_123');
      expect(WebhookEvent.findOneAndUpdate).toHaveBeenCalled();
      expect(res.processed).toBe(true);
    });
  });
});

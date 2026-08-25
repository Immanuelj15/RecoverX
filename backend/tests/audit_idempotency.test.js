const idempotencyService = require('../src/services/idempotencyService');
const auditService = require('../src/services/auditService');
const WebhookRepository = require('../src/repositories/WebhookRepository');
const AuditLogRepository = require('../src/repositories/AuditLogRepository');

describe('Phase 8: Audit Logging + Idempotency Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    idempotencyService.activeLocks.clear();
  });

  describe('Idempotency Service', () => {
    test('acquireLock grants lock and blocks concurrent duplicate lock', () => {
      const lock1 = idempotencyService.acquireLock('pay_100');
      expect(lock1).toBe(true);

      const lock2 = idempotencyService.acquireLock('pay_100');
      expect(lock2).toBe(false);

      idempotencyService.releaseLock('pay_100');
      const lock3 = idempotencyService.acquireLock('pay_100');
      expect(lock3).toBe(true);
    });

    test('registerWebhookEvent detects already processed duplicate events', async () => {
      const mockEvent = { event_id: 'evt_dup_1', event_type: 'payment.failed', processed: true };
      jest.spyOn(WebhookRepository, 'findByEventId').mockResolvedValue(mockEvent);

      const res = await idempotencyService.registerWebhookEvent('evt_dup_1', 'payment.failed', {});
      expect(res.isDuplicate).toBe(true);
      expect(res.event.event_id).toEqual('evt_dup_1');
    });

    test('registerWebhookEvent saves new unprocessed webhook event', async () => {
      jest.spyOn(WebhookRepository, 'findByEventId').mockResolvedValue(null);
      jest.spyOn(WebhookRepository, 'saveEvent').mockResolvedValue({ event_id: 'evt_new_1', processed: false });

      const res = await idempotencyService.registerWebhookEvent('evt_new_1', 'payment.failed', { amount: 8499 });
      expect(res.isDuplicate).toBe(false);
      expect(WebhookRepository.saveEvent).toHaveBeenCalled();
    });
  });

  describe('Audit Service', () => {
    test('recordAuditEvent constructs structured audit record and persists', async () => {
      const mockSaved = {
        payment_id: 'pay_audit_1',
        event_type: 'ACTION_EXECUTED',
        result: 'SUCCESS'
      };
      jest.spyOn(AuditLogRepository, 'createLog').mockResolvedValue(mockSaved);

      const res = await auditService.recordAuditEvent({
        payment_id: 'pay_audit_1',
        event_type: 'ACTION_EXECUTED',
        failure_reason: 'insufficient_balance',
        recovery_probability: 0.87,
        ai_recommendation: { recommended_action: 'DELAYED_RETRY' },
        policy_decision: { decision: 'ALLOWED' },
        action: 'DELAYED_RETRY',
        amount_recovered: 8499
      });

      expect(AuditLogRepository.createLog).toHaveBeenCalledWith(
        expect.objectContaining({
          payment_id: 'pay_audit_1',
          event_type: 'ACTION_EXECUTED',
          ai_recommendation: 'DELAYED_RETRY',
          policy_decision: 'ALLOWED',
          amount_recovered: 8499
        })
      );
      expect(res.payment_id).toEqual('pay_audit_1');
    });

    test('getPaymentAuditTimeline queries AuditLogRepository for timeline', async () => {
      const mockTimeline = [
        { event_type: 'STATE_TRANSITION_DETECTED' },
        { event_type: 'STATE_TRANSITION_ANALYZING' }
      ];
      jest.spyOn(AuditLogRepository, 'findByPaymentId').mockResolvedValue(mockTimeline);

      const timeline = await auditService.getPaymentAuditTimeline('pay_audit_1');
      expect(AuditLogRepository.findByPaymentId).toHaveBeenCalledWith('pay_audit_1');
      expect(timeline).toHaveLength(2);
    });
  });
});

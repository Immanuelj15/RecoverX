const {
  recoveryStateMachine,
  RECOVERY_STATES,
  InvalidStateTransitionError
} = require('../src/services/recoveryStateMachine');
const TransactionRepository = require('../src/repositories/TransactionRepository');
const AuditLogRepository = require('../src/repositories/AuditLogRepository');

describe('Phase 6: Recovery State Machine Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Transition Validation', () => {
    test('canTransition approves valid state machine pathways', () => {
      expect(recoveryStateMachine.canTransition('DETECTED', 'ANALYZING')).toBe(true);
      expect(recoveryStateMachine.canTransition('ANALYZING', 'PREDICTED')).toBe(true);
      expect(recoveryStateMachine.canTransition('PREDICTED', 'RECOMMENDED')).toBe(true);
      expect(recoveryStateMachine.canTransition('RECOMMENDED', 'POLICY_CHECK')).toBe(true);
      expect(recoveryStateMachine.canTransition('POLICY_CHECK', 'ACTION_APPROVED')).toBe(true);
      expect(recoveryStateMachine.canTransition('ACTION_APPROVED', 'ACTION_EXECUTING')).toBe(true);
      expect(recoveryStateMachine.canTransition('ACTION_EXECUTING', 'RECOVERY_SUCCESS')).toBe(true);
    });

    test('canTransition rejects invalid or illegal state jumps', () => {
      expect(recoveryStateMachine.canTransition('DETECTED', 'RECOVERY_SUCCESS')).toBe(false);
      expect(recoveryStateMachine.canTransition('RECOMMENDED', 'RECOVERY_SUCCESS')).toBe(false);
      expect(recoveryStateMachine.canTransition('RECOVERY_SUCCESS', 'ANALYZING')).toBe(false);
    });
  });

  describe('Transition Execution', () => {
    test('transition executes valid transition and records audit log', async () => {
      const mockTxn = { payment_id: 'pay_001', recovery_state: 'DETECTED', amount_inr: 8499 };
      const mockUpdated = { payment_id: 'pay_001', recovery_state: 'ANALYZING', amount_inr: 8499 };

      jest.spyOn(TransactionRepository, 'findByPaymentId').mockResolvedValue(mockTxn);
      jest.spyOn(TransactionRepository, 'updateState').mockResolvedValue(mockUpdated);
      jest.spyOn(AuditLogRepository, 'createLog').mockResolvedValue({ _id: 'audit_123' });

      const res = await recoveryStateMachine.transition('pay_001', 'ANALYZING');

      expect(TransactionRepository.updateState).toHaveBeenCalledWith('pay_001', 'ANALYZING', {});
      expect(AuditLogRepository.createLog).toHaveBeenCalledWith(
        expect.objectContaining({
          payment_id: 'pay_001',
          event_type: 'STATE_TRANSITION_ANALYZING',
          result: 'SUCCESS'
        })
      );
      expect(res.recovery_state).toEqual('ANALYZING');
    });

    test('transition throws InvalidStateTransitionError and logs blocked attempt when invalid jump is attempted', async () => {
      const mockTxn = { payment_id: 'pay_002', recovery_state: 'DETECTED' };

      jest.spyOn(TransactionRepository, 'findByPaymentId').mockResolvedValue(mockTxn);
      jest.spyOn(AuditLogRepository, 'createLog').mockResolvedValue({ _id: 'audit_124' });

      await expect(
        recoveryStateMachine.transition('pay_002', 'RECOVERY_SUCCESS')
      ).rejects.toThrow(InvalidStateTransitionError);

      expect(AuditLogRepository.createLog).toHaveBeenCalledWith(
        expect.objectContaining({
          payment_id: 'pay_002',
          event_type: 'INVALID_STATE_TRANSITION_ATTEMPT',
          result: 'BLOCKED'
        })
      );
    });
  });
});

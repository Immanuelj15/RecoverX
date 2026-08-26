const recoveryExecutor = require('../src/services/recoveryExecutor');
const razorpayService = require('../src/services/razorpayService');
const { recoveryStateMachine, RECOVERY_STATES } = require('../src/services/recoveryStateMachine');
const TransactionRepository = require('../src/repositories/TransactionRepository');
const AuditLogRepository = require('../src/repositories/AuditLogRepository');

describe('Phase 15: Recovery Execution Workflow Test Suite', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('SMART_RETRY executes Razorpay payment retry and updates state to RECOVERY_SUCCESS on success', async () => {
    const mockTxn = { payment_id: 'pay_exec_001', amount_inr: 4999, payment_method: 'card', retry_count: 0 };
    jest.spyOn(razorpayService, 'retryPayment').mockResolvedValue({ success: true, razorpay_payment_id: 'pay_rzp_mock_101' });
    jest.spyOn(recoveryStateMachine, 'transition').mockResolvedValue({});
    jest.spyOn(AuditLogRepository, 'createLog').mockResolvedValue({});

    const result = await recoveryExecutor.executeRecoveryAction(mockTxn, 'SMART_RETRY', 'corr_exec_001');

    expect(result.status).toEqual(RECOVERY_STATES.RECOVERY_SUCCESS);
    expect(result.success).toBe(true);
    expect(recoveryStateMachine.transition).toHaveBeenCalledWith('pay_exec_001', RECOVERY_STATES.RECOVERY_SUCCESS, expect.any(Object));
    expect(AuditLogRepository.createLog).toHaveBeenCalledWith(expect.objectContaining({
      payment_id: 'pay_exec_001',
      event_type: 'ACTION_EXECUTED'
    }));
  });

  test('SMART_RETRY updates state to RECOVERY_FAILED on payment retry failure', async () => {
    const mockTxn = { payment_id: 'pay_exec_002', amount_inr: 2999, payment_method: 'upi', retry_count: 1 };
    jest.spyOn(razorpayService, 'retryPayment').mockResolvedValue({ success: false, error: 'INSUFFICIENT_FUNDS' });
    jest.spyOn(recoveryStateMachine, 'transition').mockResolvedValue({});
    jest.spyOn(AuditLogRepository, 'createLog').mockResolvedValue({});

    const result = await recoveryExecutor.executeRecoveryAction(mockTxn, 'SMART_RETRY', 'corr_exec_002');

    expect(result.status).toEqual(RECOVERY_STATES.RECOVERY_FAILED);
    expect(result.success).toBe(false);
    expect(recoveryStateMachine.transition).toHaveBeenCalledWith('pay_exec_002', RECOVERY_STATES.RECOVERY_FAILED, expect.any(Object));
  });

  test('DELAYED_RETRY schedules next_retry_scheduled_at date and logs audit event', async () => {
    const mockTxn = { payment_id: 'pay_exec_003', amount_inr: 8999, payment_method: 'netbanking' };
    jest.spyOn(TransactionRepository, 'updateState').mockResolvedValue({});
    jest.spyOn(AuditLogRepository, 'createLog').mockResolvedValue({});

    const result = await recoveryExecutor.executeRecoveryAction(mockTxn, 'DELAYED_RETRY', 'corr_exec_003');

    expect(result.status).toEqual('SCHEDULED');
    expect(result.action).toEqual('DELAYED_RETRY');
    expect(TransactionRepository.updateState).toHaveBeenCalledWith('pay_exec_003', RECOVERY_STATES.ACTION_APPROVED, expect.objectContaining({
      next_retry_scheduled_at: expect.any(Date)
    }));
  });

  test('PAYMENT_RECOVERY_NUDGE generates recovery link and logs nudge payload', async () => {
    const mockTxn = { payment_id: 'pay_exec_004', customer_id: 'cust_909', amount_inr: 12499 };
    jest.spyOn(AuditLogRepository, 'createLog').mockResolvedValue({});

    const result = await recoveryExecutor.executeRecoveryAction(mockTxn, 'PAYMENT_RECOVERY_NUDGE', 'corr_exec_004');

    expect(result.status).toEqual('NUDGE_SENT');
    expect(result.nudge_payload.recovery_link).toContain('pay_exec_004');
    expect(AuditLogRepository.createLog).toHaveBeenCalledWith(expect.objectContaining({
      payment_id: 'pay_exec_004',
      event_type: 'ACTION_EXECUTED'
    }));
  });

  test('HUMAN_ESCALATION transitions transaction to ESCALATED state', async () => {
    const mockTxn = { payment_id: 'pay_exec_005', amount_inr: 75000 };
    jest.spyOn(recoveryStateMachine, 'transition').mockResolvedValue({});
    jest.spyOn(AuditLogRepository, 'createLog').mockResolvedValue({});

    const result = await recoveryExecutor.executeRecoveryAction(mockTxn, 'HUMAN_ESCALATION', 'corr_exec_005');

    expect(result.status).toEqual(RECOVERY_STATES.ESCALATED);
    expect(recoveryStateMachine.transition).toHaveBeenCalledWith('pay_exec_005', RECOVERY_STATES.ESCALATED, expect.any(Object));
    expect(AuditLogRepository.createLog).toHaveBeenCalledWith(expect.objectContaining({
      event_type: 'ESCALATED_FOR_MANUAL_REVIEW'
    }));
  });

  test('STOP action terminates recovery process and updates state to STOPPED', async () => {
    const mockTxn = { payment_id: 'pay_exec_006', failure_reason: 'card_expired' };
    jest.spyOn(recoveryStateMachine, 'transition').mockResolvedValue({});
    jest.spyOn(AuditLogRepository, 'createLog').mockResolvedValue({});

    const result = await recoveryExecutor.executeRecoveryAction(mockTxn, 'STOP', 'corr_exec_006');

    expect(result.status).toEqual(RECOVERY_STATES.STOPPED);
    expect(recoveryStateMachine.transition).toHaveBeenCalledWith('pay_exec_006', RECOVERY_STATES.STOPPED, expect.any(Object));
    expect(AuditLogRepository.createLog).toHaveBeenCalledWith(expect.objectContaining({
      event_type: 'RECOVERY_STOPPED'
    }));
  });
});

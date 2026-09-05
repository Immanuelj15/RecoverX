const TransactionRepository = require('../repositories/TransactionRepository');
const AuditLogRepository = require('../repositories/AuditLogRepository');
const RecoveryWorkflowService = require('../services/recoveryWorkflow');
const logger = require('../utils/logger');

class TransactionController {
  async getTransactions(req, res) {
    try {
      const result = await TransactionRepository.findAll(req.query);
      const rawList = result?.transactions || result?.data || (Array.isArray(result) ? result : []);

      const transactionsList = rawList.map((t) => {
        const prob = typeof t.recovery_probability === 'number' ? t.recovery_probability : 0.75;
        const amountInr = t.amount_inr || (t.amount?.value_paise ? t.amount.value_paise / 100 : 0);
        const amountPaise = t.amount?.value_paise || Math.round(amountInr * 100);
        const expectedRecoveryInr = Math.round(amountInr * prob);
        const expectedRecoveryPaise = Math.round(amountPaise * prob);

        const retryCount = t.retry_count || 1;
        const urgencyFactor = retryCount <= 1 ? 1.2 : 0.9;
        const ltvInr = t.customer_ltv_inr || 15000;
        const customerValueFactor = ltvInr >= 20000 ? 1.3 : 1.0;
        const priorityScore = Math.round(amountInr * prob * urgencyFactor * customerValueFactor);

        let policyStatus = 'APPROVED';
        let policyReason = 'Recovery probability above 30% floor and retry cap valid';
        if (amountInr >= 50000) {
          policyStatus = 'ESCALATED';
          policyReason = 'High-value transaction >= ₹50,000 requiring human sign-off';
        } else if (prob < 0.30) {
          policyStatus = 'BLOCKED';
          policyReason = 'Recovery probability below 30% floor';
        } else if (retryCount >= 3) {
          policyStatus = 'BLOCKED';
          policyReason = 'Max retry cap (3) reached';
        } else if (['card_expired', 'invalid_account', 'fraud_suspected'].includes(t.failure_reason)) {
          policyStatus = 'BLOCKED';
          policyReason = `Unrecoverable failure code: ${t.failure_reason}`;
        }

        return {
          ...t,
          expected_recovery_inr: expectedRecoveryInr,
          expected_recovery_paise: expectedRecoveryPaise,
          priority_score: priorityScore,
          policy_status: policyStatus,
          policy_reason: policyReason
        };
      });

      return res.status(200).json({
        status: 'success',
        data: transactionsList,
        total: result?.total ?? transactionsList.length,
        page: result?.page ?? 1,
        totalPages: result?.totalPages ?? 1
      });
    } catch (error) {
      logger.error(`Error fetching transactions: ${error.message}`);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getTransactionByPaymentId(req, res) {
    try {
      const { payment_id } = req.params;
      const transaction = await TransactionRepository.findByPaymentId(payment_id);
      if (!transaction) {
        return res.status(404).json({ status: 'error', error: `Transaction '${payment_id}' not found` });
      }

      const auditLogs = await AuditLogRepository.findByPaymentId(payment_id);
      return res.status(200).json({
        status: 'success',
        data: transaction,
        timeline: auditLogs
      });
    } catch (error) {
      logger.error(`Error fetching transaction ${req.params.payment_id}: ${error.message}`);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async triggerRecovery(req, res) {
    try {
      const { payment_id } = req.params;
      const transaction = await TransactionRepository.findByPaymentId(payment_id);
      if (!transaction) {
        return res.status(404).json({ status: 'error', error: `Transaction '${payment_id}' not found` });
      }

      const outcome = await (RecoveryWorkflowService.runRecoveryWorkflow ? RecoveryWorkflowService.runRecoveryWorkflow(payment_id) : RecoveryWorkflowService.processRecoveryWorkflow(payment_id));
      return res.status(200).json({
        status: 'success',
        payment_id,
        data: { payment_id, ...outcome },
        outcome
      });
    } catch (error) {
      logger.error(`Error triggering recovery for ${req.params.payment_id}: ${error.message}`);
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new TransactionController();

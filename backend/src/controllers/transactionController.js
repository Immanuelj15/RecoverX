const TransactionRepository = require('../repositories/TransactionRepository');
const AuditLogRepository = require('../repositories/AuditLogRepository');
const RecoveryWorkflowService = require('../services/recoveryWorkflow');
const logger = require('../utils/logger');

class TransactionController {
  async getTransactions(req, res) {
    try {
      const result = await TransactionRepository.findAll(req.query);
      const transactionsList = result?.transactions || result?.data || (Array.isArray(result) ? result : []);
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

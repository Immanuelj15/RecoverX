const recoveryOutcomeRepository = require('../repositories/recoveryOutcomeRepository');
const recoveryCaseRepository = require('../repositories/recoveryCaseRepository');
const AuditLogRepository = require('../repositories/AuditLogRepository');
const logger = require('../utils/logger');

class RecoveryOutcomeService {
  /**
   * Records or updates a verified recovery outcome for a case or payment
   */
  async recordVerifiedOutcome({ merchant_id, recovery_case_id, payment_id, status, amount_recovered_paise, fee_paise = 0, notes = '' }) {
    try {
      const recoveredPaise = Math.max(0, parseInt(amount_recovered_paise || 0, 10));
      const fee = Math.max(0, parseInt(fee_paise || 0, 10));
      const netRecoveredPaise = Math.max(0, recoveredPaise - fee);

      const outcomeRecord = await recoveryOutcomeRepository.recordOutcome({
        merchant_id,
        recovery_case_id,
        payment_id,
        status: status || (recoveredPaise > 0 ? 'RECOVERED' : 'UNRECOVERABLE'),
        amount_recovered_paise: recoveredPaise,
        net_recovered_paise: netRecoveredPaise,
        recovered_at: recoveredPaise > 0 ? new Date() : null,
        notes
      });

      // Update case status if recovery_case_id exists
      if (merchant_id && recovery_case_id) {
        const caseStatus = recoveredPaise > 0 ? 'RESOLVED_RECOVERED' : 'CLOSED_UNRECOVERABLE';
        await recoveryCaseRepository.updateStatus(merchant_id, recovery_case_id, caseStatus);
      }

      if (payment_id) {
        await AuditLogRepository.createLog({
          merchant_id,
          payment_id,
          event_type: 'ACTION_EXECUTED',
          performed_by: 'RECOVERY_OUTCOME_SERVICE',
          previous_state: 'ACTION_EXECUTING',
          new_state: status || 'RECOVERED',
          details: {
            amount_recovered_paise: recoveredPaise,
            net_recovered_paise: netRecoveredPaise,
            amount_recovered_inr: (recoveredPaise / 100).toFixed(2)
          }
        });
      }

      logger.info(`Recorded verified recovery outcome for payment ${payment_id}: ₹${(recoveredPaise / 100).toFixed(2)} (${status})`);
      return outcomeRecord;
    } catch (error) {
      logger.error(`Error recording recovery outcome: ${error.message}`);
      throw error;
    }
  }

  /**
   * Computes merchant recovery money metrics in integer paise & INR
   */
  async computeMerchantMoneyMetrics(merchant_id) {
    const caseStats = await recoveryCaseRepository.getRecoveryStats(merchant_id);
    const recoveredPaise = caseStats.total_recovered_paise || 0;
    const lostPaise = caseStats.total_lost_paise || 0;
    const totalPaise = recoveredPaise + lostPaise;
    const recoveryRate = totalPaise > 0 ? parseFloat((recoveredPaise / totalPaise).toFixed(4)) : 0.0;

    return {
      total_recovered_paise: recoveredPaise,
      total_lost_paise: lostPaise,
      total_recovered_inr: (recoveredPaise / 100).toFixed(2),
      total_lost_inr: (lostPaise / 100).toFixed(2),
      recovery_rate: recoveryRate,
      recovery_rate_percentage: (recoveryRate * 100).toFixed(2) + '%'
    };
  }
}

module.exports = new RecoveryOutcomeService();

const AuditLogRepository = require('../repositories/AuditLogRepository');
const logger = require('../utils/logger');

class AuditService {
  /**
   * Records a structured audit event
   */
  async recordAuditEvent(eventData) {
    const {
      payment_id,
      correlation_id,
      event_type,
      failure_reason,
      recovery_probability,
      ai_recommendation,
      policy_decision,
      action,
      result,
      amount_recovered,
      model_version = 'v1.0.0',
      agent_version = 'v1.0.0',
      details
    } = eventData;

    if (!payment_id || !event_type) {
      throw new Error('Audit log event must include payment_id and event_type');
    }

    const auditEntry = {
      payment_id,
      timestamp: new Date(),
      correlation_id: correlation_id || `corr_${payment_id}_${Date.now()}`,
      event_type,
      failure_reason: failure_reason || null,
      recovery_probability: recovery_probability !== undefined ? recovery_probability : null,
      ai_recommendation: typeof ai_recommendation === 'object' ? ai_recommendation.recommended_action : ai_recommendation || null,
      policy_decision: typeof policy_decision === 'object' ? policy_decision.decision : policy_decision || null,
      action: action || null,
      result: result || 'SUCCESS',
      amount_recovered: amount_recovered || 0,
      model_version,
      agent_version,
      details: details || {}
    };

    const savedLog = await AuditLogRepository.createLog(auditEntry);
    logger.info(`Audit log recorded for ${payment_id}: [${event_type}] -> ${result}`);
    return savedLog;
  }

  /**
   * Retrieves full chronological audit timeline for a payment
   */
  async getPaymentAuditTimeline(paymentId) {
    return AuditLogRepository.findByPaymentId(paymentId);
  }

  /**
   * Retrieves paginated audit logs for dashboard view
   */
  async getAuditLogs(options = {}) {
    return AuditLogRepository.findAll(options);
  }
}

module.exports = new AuditService();

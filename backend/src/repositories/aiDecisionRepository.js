const { AIDecision } = require('../models');

class AIDecisionRepository {
  async saveDecision(decisionData) {
    return AIDecision.create(decisionData);
  }

  async findLatestByCaseId(merchantId, caseId) {
    return AIDecision.findOne({ merchant_id: merchantId, recovery_case_id: caseId })
      .sort({ created_at: -1 })
      .lean();
  }
}

module.exports = new AIDecisionRepository();

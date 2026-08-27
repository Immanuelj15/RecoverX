const { AIDecision } = require('../models');
const logger = require('../utils/logger');

class AIDecisionRepository {
  /**
   * Persists an AI Decision document in MongoDB
   */
  async saveDecision(decisionData) {
    try {
      return await AIDecision.create(decisionData);
    } catch (error) {
      logger.error(`Error saving AIDecision record: ${error.message}`);
      return null;
    }
  }

  /**
   * Finds latest AI decision for a given merchant and recovery case ID
   */
  async findLatestByCaseId(merchantId, caseId) {
    return AIDecision.findOne({ merchant_id: merchantId, recovery_case_id: caseId })
      .sort({ created_at: -1 })
      .lean();
  }

  /**
   * Queries AI decisions with pagination for audit inspection
   */
  async findByMerchantId(merchantId, { page = 1, limit = 20 } = {}) {
    const skip = (page - 1) * limit;
    const [decisions, total] = await Promise.all([
      AIDecision.find({ merchant_id: merchantId })
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      AIDecision.countDocuments({ merchant_id: merchantId })
    ]);
    return { decisions, total, page, limit };
  }
}

module.exports = new AIDecisionRepository();

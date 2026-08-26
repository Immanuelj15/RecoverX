const { PolicyDecision } = require('../models');

class PolicyDecisionRepository {
  async savePolicyDecision(policyData) {
    return PolicyDecision.create(policyData);
  }

  async findLatestByCaseId(merchantId, caseId) {
    return PolicyDecision.findOne({ merchant_id: merchantId, recovery_case_id: caseId })
      .sort({ created_at: -1 })
      .lean();
  }
}

module.exports = new PolicyDecisionRepository();

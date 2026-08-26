const { MLPrediction } = require('../models');

class PredictionRepository {
  async savePrediction(predictionData) {
    return MLPrediction.create(predictionData);
  }

  async findLatestByCaseId(merchantId, caseId) {
    return MLPrediction.findOne({ merchant_id: merchantId, recovery_case_id: caseId })
      .sort({ created_at: -1 })
      .lean();
  }
}

module.exports = new PredictionRepository();

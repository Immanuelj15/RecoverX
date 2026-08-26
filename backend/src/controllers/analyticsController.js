const AnalyticsService = require('../services/analyticsService');
const logger = require('../utils/logger');

class AnalyticsController {
  async getSummary(req, res) {
    try {
      const summary = await AnalyticsService.getDashboardSummary();
      return res.status(200).json({ status: 'success', data: summary });
    } catch (error) {
      logger.error(`Error fetching analytics summary: ${error.message}`);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getCharts(req, res) {
    try {
      const [byReason, byMethod, byIntervention] = await Promise.all([
        AnalyticsService.getRecoveryByFailureReason(),
        AnalyticsService.getRecoveryByPaymentMethod(),
        AnalyticsService.getRecoveryByInterventionType()
      ]);

      return res.status(200).json({
        status: 'success',
        data: {
          failure_reasons: byReason,
          payment_methods: byMethod,
          intervention_types: byIntervention
        }
      });
    } catch (error) {
      logger.error(`Error fetching analytics charts: ${error.message}`);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = new AnalyticsController();

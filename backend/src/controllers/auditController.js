const AuditLogRepository = require('../repositories/AuditLogRepository');
const logger = require('../utils/logger');

class AuditController {
  async getAuditLogs(req, res) {
    try {
      const result = await AuditLogRepository.findAll(req.query);
      return res.status(200).json({ status: 'success', ...result });
    } catch (error) {
      logger.error(`Error fetching audit logs: ${error.message}`);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = new AuditController();

const AuditLogRepository = require('../repositories/AuditLogRepository');
const logger = require('../utils/logger');

class AuditController {
  async getAuditLogs(req, res) {
    try {
      const result = await AuditLogRepository.findAll(req.query);
      const logsList = result?.logs || result?.data || (Array.isArray(result) ? result : []);
      return res.status(200).json({
        status: 'success',
        data: logsList,
        total: result?.total ?? logsList.length,
        page: result?.page ?? 1,
        totalPages: result?.totalPages ?? 1
      });
    } catch (error) {
      logger.error(`Error fetching audit logs: ${error.message}`);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = new AuditController();

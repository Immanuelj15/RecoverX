const { AuditLog } = require('../models');

class AuditLogRepository {
  async createLog(logData) {
    const auditLog = new AuditLog(logData);
    return auditLog.save();
  }

  async recordAuditLog(logData) {
    return this.createLog(logData);
  }

  async findByPaymentId(paymentId) {
    return AuditLog.find({ payment_id: paymentId })
      .sort({ timestamp: 1 })
      .lean();
  }

  async findAll(options = {}) {
    const { page = 1, limit = 50, event_type, payment_id } = options;
    const query = {};

    if (event_type) query.event_type = event_type;
    if (payment_id) query.payment_id = payment_id;

    const skip = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10);

    const [data, total] = await Promise.all([
      AuditLog.find(query)
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(parseInt(limit, 10))
        .lean(),
      AuditLog.countDocuments(query)
    ]);

    return {
      data,
      total,
      page: parseInt(page, 10),
      totalPages: Math.ceil(total / limit)
    };
  }
}

module.exports = new AuditLogRepository();

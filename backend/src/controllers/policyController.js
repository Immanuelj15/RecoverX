const PolicyRepository = require('../repositories/PolicyRepository');
const logger = require('../utils/logger');

class PolicyController {
  async getPolicy(req, res) {
    try {
      const policy = await PolicyRepository.getGlobalPolicy();
      return res.status(200).json({ status: 'success', data: policy });
    } catch (error) {
      logger.error(`Error fetching policy: ${error.message}`);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async updatePolicy(req, res) {
    try {
      const updatedPolicy = await PolicyRepository.updateGlobalPolicy(req.body);
      return res.status(200).json({ status: 'success', data: updatedPolicy });
    } catch (error) {
      logger.error(`Error updating policy: ${error.message}`);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = new PolicyController();

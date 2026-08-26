const { Customer } = require('../models');

class CustomerRepository {
  async upsertCustomer(merchantId, customerData) {
    return Customer.findOneAndUpdate(
      { merchant_id: merchantId, customer_id: customerData.customer_id },
      { $set: customerData },
      { upsert: true, new: true, runValidators: true }
    );
  }

  async findByCustomerId(merchantId, customerId) {
    return Customer.findOne({ merchant_id: merchantId, customer_id: customerId }).lean();
  }

  async incrementStats(merchantId, customerId, { isSuccess, isFailed, recoveredPaise = 0 }) {
    const inc = {
      'stats.total_payments': 1
    };
    if (isSuccess) inc['stats.successful_payments'] = 1;
    if (isFailed) inc['stats.failed_payments'] = 1;
    if (recoveredPaise > 0) inc['stats.total_recovered_paise'] = recoveredPaise;

    return Customer.findOneAndUpdate(
      { merchant_id: merchantId, customer_id: customerId },
      { $inc: inc },
      { new: true }
    );
  }
}

module.exports = new CustomerRepository();

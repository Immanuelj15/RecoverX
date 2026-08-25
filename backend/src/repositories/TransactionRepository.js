const { Transaction } = require('../models');

class TransactionRepository {
  async findById(id) {
    return Transaction.findById(id);
  }

  async findByPaymentId(paymentId) {
    return Transaction.findOne({ payment_id: paymentId });
  }

  async findAll(options = {}) {
    const {
      page = 1,
      limit = 20,
      state,
      failure_reason,
      payment_method,
      risk_band,
      recovered,
      search
    } = options;

    const query = {};

    if (state) query.recovery_state = state;
    if (failure_reason) query.failure_reason = failure_reason;
    if (payment_method) query.payment_method = payment_method;
    if (risk_band) query.risk_band = risk_band;
    if (recovered !== undefined) query.recovered = Number(recovered);

    if (search) {
      query.$or = [
        { payment_id: { $regex: search, $options: 'i' } },
        { customer_id: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10);

    const [data, total] = await Promise.all([
      Transaction.find(query)
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(parseInt(limit, 10))
        .lean(),
      Transaction.countDocuments(query)
    ]);

    return {
      data,
      total,
      page: parseInt(page, 10),
      totalPages: Math.ceil(total / limit)
    };
  }

  async create(transactionData) {
    const transaction = new Transaction(transactionData);
    return transaction.save();
  }

  async updateState(paymentId, state, extraFields = {}) {
    return Transaction.findOneAndUpdate(
      { payment_id: paymentId },
      {
        $set: {
          recovery_state: state,
          ...extraFields,
          updated_at: new Date()
        }
      },
      { new: true, runValidators: true }
    );
  }

  async updateRecoveryOutcome(paymentId, outcomeData) {
    const { recovered, outcome, amount_recovered, executed_action } = outcomeData;
    return Transaction.findOneAndUpdate(
      { payment_id: paymentId },
      {
        $set: {
          recovered: recovered ? 1 : 0,
          outcome,
          amount_recovered: amount_recovered || 0,
          executed_action: executed_action || null,
          updated_at: new Date()
        }
      },
      { new: true, runValidators: true }
    );
  }
}

module.exports = new TransactionRepository();

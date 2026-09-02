const PromiseToPay = require('../models/PromiseToPay');
const ImmutableAuditLog = require('../models/ImmutableAuditLog');

exports.getAll = async (req, res) => {
  try {
    const promises = await PromiseToPay.find({}).sort({ promisedDate: 1 });
    res.status(200).json({ status: 'success', data: promises });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const ptp = await PromiseToPay.create(req.body);
    await ImmutableAuditLog.create({
      leakageEventId: ptp.leakageEventId,
      actor: 'HUMAN_AGENT',
      logMessage: `Promise to Pay captured for ₹${ptp.promisedAmount} due on ${ptp.promisedDate}`,
      payload: ptp
    });
    res.status(201).json({ status: 'success', data: ptp });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.fulfill = async (req, res) => {
  try {
    const ptp = await PromiseToPay.findByIdAndUpdate(req.params.id, { status: 'FULFILLED' }, { new: true });
    await ImmutableAuditLog.create({
      leakageEventId: ptp.leakageEventId,
      actor: 'SYSTEM_DETECT',
      logMessage: `Promise to Pay FULFILLED for ₹${ptp.promisedAmount}`,
      payload: ptp
    });
    res.status(200).json({ status: 'success', data: ptp });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.miss = async (req, res) => {
  try {
    const ptp = await PromiseToPay.findByIdAndUpdate(req.params.id, { status: 'MISSED' }, { new: true });
    await ImmutableAuditLog.create({
      leakageEventId: ptp.leakageEventId,
      actor: 'SYSTEM_DETECT',
      logMessage: `Promise to Pay MISSED for ₹${ptp.promisedAmount}`,
      payload: ptp
    });
    res.status(200).json({ status: 'success', data: ptp });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

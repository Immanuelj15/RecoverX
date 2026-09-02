const LeakageEvent = require('../models/LeakageEvent');
const ImmutableAuditLog = require('../models/ImmutableAuditLog');

const mockBatch = [
  { channel: 'PAYMENT_DEGRADATION', customerName: 'Beta Solutions', customerEmail: 'billing@beta.io', riskAmount: 1200, currency: 'INR', declineReasonCode: 'Gateway Timeout (504)' },
  { channel: 'CHECKOUT_DROPOFF', customerName: 'Sarah Jenkins', customerEmail: 'sarah.j@example.com', riskAmount: 350, currency: 'INR', declineReasonCode: 'Cart Drop at Payment' },
  { channel: 'FAILED_SUBSCRIPTION', customerName: 'Acme Corp', customerEmail: 'admin@acmecorp.com', riskAmount: 120, currency: 'INR', declineReasonCode: '20051 - Insufficient Funds' },
  { channel: 'B2B_RECEIVABLES', customerName: 'Global Tech', customerEmail: 'finance@globaltech.com', riskAmount: 45000, currency: 'INR', declineReasonCode: '45 Days Overdue' },
  { channel: 'MANDATE_RETRY', customerName: 'John Doe', customerEmail: 'john.doe@example.com', riskAmount: 850, currency: 'INR', declineReasonCode: 'e-Mandate Execution Failed' },
  { channel: 'PROMISE_TO_PAY', customerName: 'Ravi Kumar', customerEmail: 'ravi@example.com', riskAmount: 15000, currency: 'INR', declineReasonCode: 'Missed PTP Deadline' },
  { channel: 'OVERDUE_INVOICE', customerName: 'Anjali Sharma', customerEmail: 'anjali@example.com', riskAmount: 8500, currency: 'INR', declineReasonCode: 'Invoice Overdue > 30 Days' }
];

exports.simulateIngestion = async (req, res) => {
  try {
    const { cohort = 'ALL', count = 120 } = req.body;
    const createdEvents = [];

    let filteredBatch = mockBatch;
    if (cohort !== 'ALL') {
      filteredBatch = mockBatch.filter(m => m.channel === cohort);
      if (filteredBatch.length === 0) filteredBatch = mockBatch;
    }

    for (let i = 0; i < count; i++) {
      const template = filteredBatch[i % filteredBatch.length];
      
      const newLeakage = await LeakageEvent.create({
        channel: template.channel,
        customerName: `${template.customerName} ${i}`,
        customerEmail: `user${i}@${template.customerEmail.split('@')[1]}`,
        customerPhone: '0000000000',
        riskAmount: template.riskAmount + (Math.floor(Math.random() * 500) - 250),
        currency: template.currency,
        declineReasonCode: template.declineReasonCode,
        status: 'DETECTED'
      });

      await ImmutableAuditLog.create({
        leakageEventId: newLeakage.id,
        actor: 'SYSTEM_DETECT',
        logMessage: `Batch simulated event ingestion for channel: ${template.channel}`,
        reasonCode: template.declineReasonCode,
        payload: { ...template, id: newLeakage.id }
      });

      createdEvents.push(newLeakage);
    }

    res.status(201).json({
      status: 'success',
      message: `Successfully ingested ${count} mock batch events.`,
      data: createdEvents
    });
  } catch (error) {
    console.error('Error simulating batch ingestion:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error during batch ingestion.' });
  }
};

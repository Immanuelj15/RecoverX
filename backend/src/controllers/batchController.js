const LeakageEvent = require('../models/LeakageEvent');
const ImmutableAuditLog = require('../models/ImmutableAuditLog');

const mockBatch = [
  { channel: 'FAILED_SUBSCRIPTION', customerName: 'Acme Corp', customerEmail: 'admin@acmecorp.com', riskAmount: 120, currency: 'USD', declineReasonCode: '20051 - Insufficient Funds' },
  { channel: 'OVERDUE_INVOICE', customerName: 'Global Tech', customerEmail: 'finance@globaltech.com', riskAmount: 4500, currency: 'USD', declineReasonCode: '45 Days Overdue' },
  { channel: 'CHECKOUT_ABANDONED', customerName: 'Sarah Jenkins', customerEmail: 'sarah.j@example.com', riskAmount: 350, currency: 'USD', declineReasonCode: 'Cart Drop at Payment' },
  { channel: 'PAYMENT_DEGRADATION', customerName: 'Beta Solutions', customerEmail: 'billing@beta.io', riskAmount: 1200, currency: 'USD', declineReasonCode: 'Gateway Timeout (504)' },
  { channel: 'FAILED_SUBSCRIPTION', customerName: 'John Doe', customerEmail: 'john.doe@example.com', riskAmount: 85, currency: 'USD', declineReasonCode: 'Card Expired' }
];

exports.simulateIngestion = async (req, res) => {
  try {
    const createdEvents = [];

    for (const mockItem of mockBatch) {
      const newLeakage = await LeakageEvent.create({
        channel: mockItem.channel,
        customerName: mockItem.customerName,
        customerEmail: mockItem.customerEmail,
        customerPhone: '0000000000',
        riskAmount: mockItem.riskAmount,
        currency: mockItem.currency,
        declineReasonCode: mockItem.declineReasonCode,
        status: 'DETECTED'
      });

      await ImmutableAuditLog.create({
        leakageEventId: newLeakage.id,
        actor: 'SYSTEM_DETECT',
        logMessage: `Batch simulated event ingestion for channel: ${mockItem.channel}`,
        reasonCode: mockItem.declineReasonCode,
        payload: mockItem
      });

      createdEvents.push(newLeakage);
    }

    res.status(201).json({
      status: 'success',
      message: 'Successfully ingested mock batch dataset.',
      data: createdEvents
    });
  } catch (error) {
    console.error('Error simulating batch ingestion:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error during batch ingestion.' });
  }
};

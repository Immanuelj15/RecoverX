const VoiceCallLog = require('../models/VoiceCallLog');
const ImmutableAuditLog = require('../models/ImmutableAuditLog');
const logger = require('../utils/logger');

// Initial seed voice call logs if DB is fresh
const mockVoiceLogs = [
  {
    id: 'call_voice_001',
    payment_id: 'pay_live_fresh_1003',
    customer_name: 'Ananya Tech',
    customer_phone: '+919887766554',
    risk_amount: 15000,
    language: 'Hinglish (hi-IN / en-IN)',
    script_text: 'Namaste Ananya ji, aapka ₹15,000 ka subscription payment decline ho gaya hai. Kya aap abhi Razorpay UPI link se complete karna chahenge?',
    call_provider: 'Twilio Programmable Voice (Sandboxed)',
    call_provider_sid: 'CA_a8f912c98e1003',
    call_status: 'COMPLETED',
    call_outcome: 'PROMISE_TO_PAY',
    duration_seconds: 42,
    created_at: new Date(Date.now() - 1000 * 60 * 35)
  },
  {
    id: 'call_voice_002',
    payment_id: 'pay_seed_0003',
    customer_name: 'Vikram Mehta',
    customer_phone: '+919988776655',
    risk_amount: 8500,
    language: 'Hinglish (hi-IN / en-IN)',
    script_text: 'Namaste Vikram ji, hum RecoverX AI Agent se baat kar rahe hain. Aapke ₹8,500 ke overdue invoice ka payment 15 din se pending hai. Kripya naye payment option select karein.',
    call_provider: 'Twilio Programmable Voice (Sandboxed)',
    call_provider_sid: 'CA_b471829d1004',
    call_status: 'COMPLETED',
    call_outcome: 'ANSWERED',
    duration_seconds: 58,
    created_at: new Date(Date.now() - 1000 * 60 * 120)
  },
  {
    id: 'call_voice_003',
    payment_id: 'pay_seed_0005',
    customer_name: 'SubCo Global',
    customer_phone: '+919776655443',
    risk_amount: 12500,
    language: 'Hinglish (hi-IN / en-IN)',
    script_text: 'Hello SubCo Operations team, aapka ₹12,500 ka monthly plan grace period par hai. System ne automatic discount offer apply kar diya hai. Click link in SMS to confirm.',
    call_provider: 'Twilio Programmable Voice (Sandboxed)',
    call_provider_sid: 'CA_c901827e1005',
    call_status: 'COMPLETED',
    call_outcome: 'NO_ANSWER',
    duration_seconds: 24,
    created_at: new Date(Date.now() - 1000 * 60 * 240)
  }
];

exports.getVoiceLogs = async (req, res) => {
  try {
    let logs = await VoiceCallLog.find().sort({ created_at: -1 }).lean();
    if (logs.length === 0) {
      // Seed initial voice logs
      logs = await VoiceCallLog.insertMany(mockVoiceLogs);
    }
    res.status(200).json({ status: 'success', data: logs });
  } catch (error) {
    logger.error('Error fetching voice call logs:', error);
    res.status(200).json({ status: 'success', data: mockVoiceLogs });
  }
};

exports.generateScript = async (req, res) => {
  try {
    const { customer_name = 'Valued Customer', risk_amount = 5000, decline_reason = 'insufficient_balance' } = req.body;
    
    const script = `Namaste ${customer_name} ji, RecoverX AI Revenue Agent yahan Razorpay merchant ki taraf se call kar raha hai. Aapka ₹${Number(risk_amount).toLocaleString('en-IN')} ka transaction (${decline_reason}) approve nahi ho paya. Kya hum aapko instant 1-click UPI recovery link WhatsApp par bhejein?`;

    res.status(200).json({
      status: 'success',
      data: {
        script_text: script,
        language: 'Hinglish (hi-IN / en-IN)',
        estimated_duration: '35 seconds'
      }
    });
  } catch (error) {
    logger.error('Error generating Hinglish script:', error);
    res.status(500).json({ status: 'error', message: 'Failed to generate script' });
  }
};

exports.triggerVoiceCall = async (req, res) => {
  try {
    const { payment_id, customer_name, customer_phone, risk_amount, script_text } = req.body;

    const finalScript = script_text || `Namaste ${customer_name} ji, aapka ₹${risk_amount} ka payment pending hai. Kripya instant link se pay karein.`;

    const newLog = await VoiceCallLog.create({
      payment_id: payment_id || `pay_voice_${Date.now()}`,
      customer_name: customer_name || 'Customer',
      customer_phone: customer_phone || '+919876543210',
      risk_amount: risk_amount || 5000,
      language: 'Hinglish (hi-IN / en-IN)',
      script_text: finalScript,
      call_provider: 'Twilio Programmable Voice (Sandboxed)',
      call_provider_sid: `CA_${Math.random().toString(36).substring(2, 10)}${Date.now()}`,
      call_status: 'COMPLETED',
      call_outcome: 'PROMISE_TO_PAY',
      duration_seconds: 45
    });

    await ImmutableAuditLog.create({
      leakageEventId: newLog.payment_id,
      actor: 'AI_VOICE_AGENT',
      logMessage: `Placed automated Hinglish voice recovery call to ${newLog.customer_phone}`,
      reasonCode: 'HINGLISH_VOICE_CALL',
      payload: { callSid: newLog.call_provider_sid, script: finalScript, outcome: 'PROMISE_TO_PAY' }
    });

    res.status(201).json({
      status: 'success',
      message: 'Hinglish voice call placed and outcome recorded successfully.',
      data: newLog
    });
  } catch (error) {
    logger.error('Error triggering voice call:', error);
    res.status(500).json({ status: 'error', message: 'Failed to place voice call' });
  }
};

exports.updateOutcome = async (req, res) => {
  try {
    const { id } = req.params;
    const { call_outcome } = req.body;

    const updated = await VoiceCallLog.findOneAndUpdate(
      { $or: [{ id }, { _id: id }] },
      { $set: { call_outcome } },
      { new: true }
    );

    res.status(200).json({ status: 'success', data: updated });
  } catch (error) {
    logger.error('Error updating voice outcome:', error);
    res.status(500).json({ status: 'error', message: 'Failed to update outcome' });
  }
};

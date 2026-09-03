const mongoose = require('mongoose');
const { randomUUID } = require('crypto');

const voiceCallLogSchema = new mongoose.Schema({
  id: {
    type: String,
    default: randomUUID,
    unique: true,
    index: true
  },
  merchant_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Merchant'
  },
  payment_id: {
    type: String,
    required: true
  },
  customer_name: {
    type: String,
    required: true
  },
  customer_phone: {
    type: String,
    default: '+919876543210'
  },
  risk_amount: {
    type: Number,
    required: true
  },
  language: {
    type: String,
    default: 'Hinglish (hi-IN / en-IN)'
  },
  script_text: {
    type: String,
    required: true
  },
  tts_audio_url: {
    type: String
  },
  call_provider: {
    type: String,
    default: 'Twilio Programmable Voice (Sandboxed)'
  },
  call_provider_sid: {
    type: String,
    default: () => `CA_${Math.random().toString(36).substring(2, 10)}${Date.now()}`
  },
  call_status: {
    type: String,
    enum: ['QUEUED', 'IN_PROGRESS', 'COMPLETED', 'FAILED'],
    default: 'COMPLETED'
  },
  call_outcome: {
    type: String,
    enum: ['PROMISE_TO_PAY', 'ANSWERED', 'NO_ANSWER', 'DECLINED', 'BUSY', 'PENDING'],
    default: 'PENDING'
  },
  duration_seconds: {
    type: Number,
    default: 45
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('VoiceCallLog', voiceCallLogSchema);

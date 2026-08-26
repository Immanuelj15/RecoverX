const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });

const env = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/recoverx',
  MONGODB_URI_TEST: process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/recoverx_test',
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || 'razorpay_secret_placeholder',
  RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET || 'webhook_secret_placeholder',
  GROQ_API_KEY: process.env.GROQ_API_KEY || '',
  GROQ_MODEL: process.env.GROQ_MODEL || 'openai/gpt-oss-20b',
  GROQ_TIMEOUT_MS: parseInt(process.env.GROQ_TIMEOUT_MS || '10000', 10),
  MAX_LLM_RETRIES: parseInt(process.env.MAX_LLM_RETRIES || '3', 10),
  MIN_RECOVERY_PROBABILITY: parseFloat(process.env.MIN_RECOVERY_PROBABILITY || '0.70'),
  MAX_RETRY_COUNT: parseInt(process.env.MAX_RETRY_COUNT || '3', 10),
  HIGH_VALUE_THRESHOLD_PAISE: parseInt(process.env.HIGH_VALUE_THRESHOLD_PAISE || '5000000', 10),
  ML_SERVICE_URL: process.env.ML_SERVICE_URL || 'http://localhost:8000'
};

function validateEnv() {
  if (process.env.NODE_ENV === 'production' && !process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI must be specified in production environment');
  }
  return env;
}

module.exports = {
  env,
  validateEnv
};

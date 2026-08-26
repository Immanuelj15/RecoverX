const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const { connectDB } = require('../config/db');
const merchantRepository = require('../repositories/merchantRepository');
const {
  Merchant,
  Customer,
  Payment,
  RecoveryCase,
  MLPrediction,
  AIDecision,
  PolicyDecision,
  RecoveryAction,
  RecoveryOutcome,
  AuditLog,
  WebhookEvent
} = require('../models');
const { inrToPaise } = require('../utils/money');
const logger = require('../utils/logger');

async function seedDatabase() {
  await connectDB();
  logger.info('Starting Fintech Database Seeding Process...');

  // 1. Seed Demo Merchant
  const merchant = await merchantRepository.getOrCreateDemoMerchant();
  logger.info(`Demo Merchant Initialized: ${merchant.merchant_code} (${merchant._id})`);

  // Clear existing collections for clean seed
  await Promise.all([
    Customer.deleteMany({ merchant_id: merchant._id }),
    Payment.deleteMany({ merchant_id: merchant._id }),
    RecoveryCase.deleteMany({ merchant_id: merchant._id }),
    MLPrediction.deleteMany({ merchant_id: merchant._id }),
    AIDecision.deleteMany({ merchant_id: merchant._id }),
    PolicyDecision.deleteMany({ merchant_id: merchant._id }),
    RecoveryAction.deleteMany({ merchant_id: merchant._id }),
    RecoveryOutcome.deleteMany({ merchant_id: merchant._id }),
    AuditLog.deleteMany({ merchant_id: merchant._id }),
    WebhookEvent.deleteMany({ merchant_id: merchant._id })
  ]);

  // 2. Seed 100 Customers
  const customerDocs = [];
  for (let i = 1; i <= 100; i++) {
    const custId = `cust_${String(i).padStart(3, '0')}`;
    customerDocs.push({
      merchant_id: merchant._id,
      customer_id: custId,
      name: `Customer ${i}`,
      email: `customer${i}@example.com`,
      phone: `+9198765${String(i).padStart(5, '0')}`,
      customer_ltv_paise: inrToPaise(10000 + (i * 500)),
      stats: {
        total_payments: 5,
        successful_payments: 4,
        failed_payments: 1,
        total_recovered_paise: inrToPaise(2500)
      }
    });
  }
  const createdCustomers = await Customer.insertMany(customerDocs);
  logger.info(`Seeded ${createdCustomers.length} Customers.`);

  // 3. Seed 500 Payments & Associated Workflow Entities
  const paymentMethods = ['upi', 'card', 'netbanking', 'wallet'];
  const failureReasons = ['insufficient_balance', 'network_error', 'bank_timeout', 'card_expired', 'otp_timeout'];
  const actions = ['SMART_RETRY', 'DELAYED_RETRY', 'PAYMENT_RECOVERY_NUDGE', 'HUMAN_ESCALATION', 'STOP'];

  const paymentsToInsert = [];
  const casesToInsert = [];
  const predictionsToInsert = [];
  const aiDecisionsToInsert = [];
  const policyDecisionsToInsert = [];
  const recoveryActionsToInsert = [];
  const outcomesToInsert = [];
  const auditLogsToInsert = [];
  const webhooksToInsert = [];

  for (let i = 1; i <= 500; i++) {
    const payId = `pay_seed_${String(i).padStart(4, '0')}`;
    const caseId = `case_seed_${String(i).padStart(4, '0')}`;
    const custObj = createdCustomers[(i - 1) % createdCustomers.length];
    const amountInr = 1000 + (i * 20);
    const amountPaise = inrToPaise(amountInr);
    const method = paymentMethods[i % paymentMethods.length];
    const reason = failureReasons[i % failureReasons.length];
    const actionType = actions[i % actions.length];

    // Payment
    paymentsToInsert.push({
      merchant_id: merchant._id,
      payment_id: payId,
      customer_id: custObj.customer_id,
      razorpay_payment_id: `pay_rzp_${payId}`,
      amount: { value_paise: amountPaise, currency: 'INR' },
      payment_method: method,
      status: 'failed',
      failure: { reason, code: 'BAD_REQUEST_ERROR', description: `Payment failed due to ${reason}` },
      history: { previous_successes: 3, previous_failures: 1, retry_count: 1 },
      subscription: { status: i % 2 === 0 ? 'active' : 'none' },
      metadata: { source: 'synthetic_dataset', dataset_version: '1.0.0' }
    });

    // Recovery Case
    const caseObjId = new mongoose.Types.ObjectId();
    const caseStatus = i % 5 === 0 ? 'RECOVERY_SUCCESS' : i % 3 === 0 ? 'RECOVERY_FAILED' : 'ACTION_APPROVED';
    casesToInsert.push({
      _id: caseObjId,
      merchant_id: merchant._id,
      payment_id: payId,
      customer_id: custObj.customer_id,
      case_id: caseId,
      status: caseStatus,
      priority: amountInr > 4000 ? 'high' : 'medium',
      revenue_at_risk_paise: amountPaise,
      current_recovery_probability: 0.75,
      current_action: actionType,
      attempt_count: 1,
      max_attempts: 3
    });

    // ML Prediction
    const predObjId = new mongoose.Types.ObjectId();
    predictionsToInsert.push({
      _id: predObjId,
      merchant_id: merchant._id,
      recovery_case_id: caseObjId,
      payment_id: payId,
      features: {
        amount_paise: amountPaise,
        payment_method: method,
        failure_reason: reason,
        previous_successes: 3,
        previous_failures: 1,
        retry_count: 1,
        customer_ltv_paise: custObj.customer_ltv_paise,
        subscription_status: 'active'
      },
      prediction: { probability: 0.75, risk_band: 'HIGH' }
    });

    // AI Decision
    const aiObjId = new mongoose.Types.ObjectId();
    aiDecisionsToInsert.push({
      _id: aiObjId,
      merchant_id: merchant._id,
      recovery_case_id: caseObjId,
      ml_prediction_id: predObjId,
      context: {
        failure_reason: reason,
        amount_paise: amountPaise,
        recovery_probability: 0.75,
        retry_count: 1,
        customer_ltv_paise: custObj.customer_ltv_paise
      },
      recommendation: { action: actionType, reason: 'Optimal recovery strategy', confidence: 0.85 },
      status: 'accepted'
    });

    // Policy Decision
    policyDecisionsToInsert.push({
      merchant_id: merchant._id,
      recovery_case_id: caseObjId,
      ai_decision_id: aiObjId,
      input: { recovery_probability: 0.75, retry_count: 1, amount_paise: amountPaise, current_status: 'RECOMMENDED' },
      rules_evaluated: [{ rule: 'MAX_RETRY_LIMIT', result: 'PASS', reason: 'Within limit' }],
      decision: 'ALLOW',
      approved_action: actionType
    });

    // Recovery Action
    const actionObjId = new mongoose.Types.ObjectId();
    recoveryActionsToInsert.push({
      _id: actionObjId,
      merchant_id: merchant._id,
      recovery_case_id: caseObjId,
      payment_id: payId,
      action_id: `act_${payId}`,
      type: actionType,
      status: caseStatus === 'RECOVERY_SUCCESS' ? 'SUCCESS' : 'EXECUTING',
      retry_number: 1,
      idempotency_key: `recoverx:${merchant.merchant_code}:${payId}:${actionType.toLowerCase()}:1`
    });

    // Recovery Outcome
    if (caseStatus === 'RECOVERY_SUCCESS') {
      outcomesToInsert.push({
        merchant_id: merchant._id,
        recovery_case_id: caseObjId,
        payment_id: payId,
        action_id: actionObjId,
        result: 'RECOVERED',
        amount_at_risk_paise: amountPaise,
        amount_recovered_paise: amountPaise,
        recovery_method: actionType,
        verification: { verified: true, source: 'razorpay_test_event' }
      });
    }

    // Audit Log
    auditLogsToInsert.push({
      merchant_id: merchant._id,
      recovery_case_id: caseObjId,
      payment_id: payId,
      event_type: 'PAYMENT_FAILED',
      actor: { type: 'RAZORPAY', id: 'webhook_gateway' },
      event: { action: 'FAIL', reason, metadata: { amount_paise: amountPaise } },
      correlation_id: `corr_${payId}_seed`,
      timestamp: new Date()
    });

    // Webhook Event
    webhooksToInsert.push({
      merchant_id: merchant._id,
      event_id: `evt_seed_${payId}`,
      event_type: 'payment.failed',
      provider: 'razorpay',
      processing_status: 'processed',
      processed_at: new Date()
    });
  }

  await Payment.insertMany(paymentsToInsert);
  await RecoveryCase.insertMany(casesToInsert);
  await MLPrediction.insertMany(predictionsToInsert);
  await AIDecision.insertMany(aiDecisionsToInsert);
  await PolicyDecision.insertMany(policyDecisionsToInsert);
  await RecoveryAction.insertMany(recoveryActionsToInsert);
  await RecoveryOutcome.insertMany(outcomesToInsert);
  await AuditLog.insertMany(auditLogsToInsert);
  await WebhookEvent.insertMany(webhooksToInsert);

  logger.info(`Seeding Complete! Created 500 Payments, Recovery Cases, Actions, Outcomes, Audit Logs, and Webhooks.`);
  process.exit(0);
}

if (require.main === module) {
  seedDatabase().catch((err) => {
    logger.error(`Seed failed: ${err.message}`, err);
    process.exit(1);
  });
}

module.exports = { seedDatabase };

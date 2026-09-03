# RecoverX API Reference Documentation

This document describes all verified REST API endpoints provided by the **RecoverX Backend API**.

---

## Base URLs
- Local Development: `http://localhost:5000/api`
- Version 1 Alias: `http://localhost:5000/api/v1`

---

## Authentication Endpoints

### 1. Login Merchant User
- **Method**: `POST`
- **Path**: `/api/v1/auth/login`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "email": "demo@recoverx.ai",
    "password": "demo-password"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "status": "success",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
    "user": {
      "id": "usr_demo_001",
      "email": "demo@recoverx.ai",
      "name": "RecoverX Demo Merchant",
      "role": "MERCHANT_ADMIN",
      "merchant_id": "merch_demo_100"
    }
  }
  ```

### 2. Get Current Authenticated User
- **Method**: `GET`
- **Path**: `/api/v1/auth/me`
- **Auth Required**: Yes (`Bearer <JWT>`)
- **Success Response (200 OK)**:
  ```json
  {
    "status": "success",
    "user": {
      "id": "usr_demo_001",
      "email": "demo@recoverx.ai",
      "name": "RecoverX Demo Merchant",
      "role": "MERCHANT_ADMIN",
      "merchant_id": "merch_demo_100"
    }
  }
  ```

### 3. Logout Merchant User
- **Method**: `POST`
- **Path**: `/api/v1/auth/logout`
- **Auth Required**: Yes (`Bearer <JWT>`)
- **Success Response (200 OK)**:
  ```json
  {
    "status": "success",
    "message": "Logged out successfully."
  }
  ```

---

## Webhook Endpoint

### 4. Razorpay Webhook Ingestion
- **Method**: `POST`
- **Path**: `/api/v1/webhooks/razorpay`
- **Auth Required**: HMAC SHA256 Signature Header (`X-Razorpay-Signature`)
- **Request Headers**: `X-Razorpay-Signature: <hmac_hex>`
- **Request Body**:
  ```json
  {
    "event": "payment.failed",
    "payload": {
      "payment": {
        "entity": {
          "id": "pay_rzp_9910",
          "amount": 1500000,
          "currency": "INR",
          "method": "upi",
          "error_code": "BAD_REQUEST_ERROR",
          "error_reason": "insufficient_balance"
        }
      }
    }
  }
  ```
- **Idempotency**: Duplicate webhook payloads with matching payment/event IDs return `200 OK` with `status: "ignored_duplicate"`.

---

## Transactions & Recovery Queue

### 5. Get Recovery Queue Transactions
- **Method**: `GET`
- **Path**: `/api/v1/transactions`
- **Auth Required**: Yes (`Bearer <JWT>`)
- **Query Parameters**: `page`, `limit`, `status`, `risk_band`, `search`
- **Success Response (200 OK)**:
  ```json
  {
    "status": "success",
    "data": [
      {
        "id": "pay_001",
        "payment_id": "pay_001",
        "customer_name": "Ananya Sharma",
        "amount": 15000,
        "amount_paise": 1500000,
        "failure_reason": "insufficient_balance",
        "recovery_probability": 0.84,
        "risk_band": "LOW_RISK",
        "status": "ACTION_APPROVED"
      }
    ]
  }
  ```

### 6. Get Single Transaction Detail
- **Method**: `GET`
- **Path**: `/api/v1/transactions/:id`
- **Auth Required**: Yes (`Bearer <JWT>`)
- **Success Response (200 OK)**:
  ```json
  {
    "status": "success",
    "data": {
      "payment_id": "pay_001",
      "customer_name": "Ananya Sharma",
      "amount": 15000,
      "recovery_probability": 0.84,
      "shap_factors": [
        { "feature": "previous_successes", "impact": "+14.2%" },
        { "feature": "payment_method", "impact": "+8.5%" }
      ],
      "ai_recommendation": {
        "action": "SMART_RETRY",
        "reason": "High historical UPI success probability during 14:30 payday window."
      },
      "policy_decision": {
        "approved": true,
        "action": "SMART_RETRY"
      }
    }
  }
  ```

### 7. Trigger AI Recovery Pipeline
- **Method**: `POST`
- **Path**: `/api/v1/recovery/:payment_id/trigger`
- **Auth Required**: Yes (`Bearer <JWT>`)
- **Success Response (200 OK)**:
  ```json
  {
    "status": "success",
    "correlation_id": "corr_pay_001_1788440834629",
    "recovery_case": {
      "payment_id": "pay_001",
      "state": "RECOVERY_SUCCESS",
      "probability": 0.84,
      "recommended_action": "SMART_RETRY",
      "policy_decision": { "approved": true, "action": "SMART_RETRY" },
      "execution_result": { "success": true, "amount_recovered": 15000 }
    }
  }
  ```

---

## Analytics, Policies & Audits

### 8. Get Analytics Summary
- **Method**: `GET`
- **Path**: `/api/v1/analytics/summary`
- **Auth Required**: Yes (`Bearer <JWT>`)
- **Success Response (200 OK)**:
  ```json
  {
    "status": "success",
    "metrics": {
      "revenueAtRiskINR": 485000,
      "netRecoveredINR": 345000,
      "recoveryRatePct": 71.13,
      "activeCasesCount": 42
    }
  }
  ```

### 9. Get & Update Recovery Policies
- **Method**: `GET` / `PUT`
- **Path**: `/api/v1/policies`
- **Auth Required**: Yes (`Bearer <JWT>`)
- **Request Body (PUT)**:
  ```json
  {
    "maxTouches": 3,
    "maxSmsTouches": 1,
    "maxEmailTouches": 2,
    "approvalThreshold": 50000,
    "pauseOnDispute": true,
    "stopAfterPayment": true
  }
  ```

### 10. Get Audit Logs
- **Method**: `GET`
- **Path**: `/api/v1/audit-logs`
- **Auth Required**: Yes (`Bearer <JWT>`)
- **Query Parameters**: `page`, `limit`
- **Success Response (200 OK)**:
  ```json
  {
    "status": "success",
    "data": [
      {
        "correlation_id": "corr_pay_001_1788440834629",
        "payment_id": "pay_001",
        "action": "ACTION_EXECUTED",
        "state_from": "ACTION_APPROVED",
        "state_to": "ACTION_EXECUTING",
        "timestamp": "2026-09-03T13:07:18.174Z"
      }
    ]
  }
  ```

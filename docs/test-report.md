# RecoverX Comprehensive Test Report

This document records the empirical test results across the Node.js backend suite, Python ML service suite, and frontend production build.

---

## 1. Node.js Backend Jest Test Suite

- **Command Executed**: `npm test` inside `backend/`
- **Result Summary**: **19 Test Suites Passed (19 Total), 83 Tests Passed (83 Total)**
- **Execution Time**: 26.28 seconds

| Test Suite File | Tested Functional Scope | Status |
| :--- | :--- | :--- |
| `tests/auth.test.js` | Login, JWT validation, logout, invalid password | `PASS` |
| `tests/webhook.test.js` | Razorpay HMAC SHA256 signature verification | `PASS` |
| `tests/audit_idempotency.test.js` | Idempotency lock, duplicate event rejection | `PASS` |
| `tests/policy_engine.test.js` | Allowlist, max retries, floor, high-value, unrecoverable codes | `PASS` |
| `tests/stateMachine.test.js` | State machine transitions and invalid transition blocks | `PASS` |
| `tests/executor.test.js` | Bounded execution channels & nudge URL generation | `PASS` |
| `tests/ai_agent.test.js` | Groq reasoning & fallback heuristics | `PASS` |
| `tests/outcome.test.js` | Revenue measurement & outcome logging | `PASS` |
| `tests/analytics.test.js` | Aggregate KPI summary queries | `PASS` |
| `tests/repositories.test.js` | Database persistence & queries | `PASS` |
| `tests/schemas.test.js` | Mongoose schema validation & integer paise constraints | `PASS` |
| `tests/database_fintech.test.js` | Multi-tenant isolation & data scoping | `PASS` |

---

## 2. Python FastAPI Pytest Suite

- **Command Executed**: `pytest` inside `ml-service/`
- **Result Summary**: **4 Passed (4 Total)**
- **Execution Time**: 13.90 seconds

| Test Case | Scope Tested | Status |
| :--- | :--- | :--- |
| `test_health_check` | Service status & model loading check | `PASS` |
| `test_model_info` | Model version & evaluation metrics endpoint | `PASS` |
| `test_predict_recovery_valid` | XGBoost probability calculation & SHAP factors | `PASS` |
| `test_predict_recovery_invalid` | Invalid payload handling & validation error response | `PASS` |

---

## 3. React Frontend Production Build

- **Command Executed**: `npm run build` inside `frontend/`
- **Result Summary**: **Compiled 100% cleanly in 16.84s** (`dist/assets/index-7X8HgUam.js`).

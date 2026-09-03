# RecoverX Frontend <-> Backend API Contract Verification

This document verifies the exact request/response data contracts between the React Frontend services and the Node.js Express Backend routes.

---

## Contract Verification Matrix

| Frontend Service / View Function | HTTP Method | Endpoint Path | Backend Route Verified? | Auth Token Attached? | Response Field Mapping Verified | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `authService.login()` | `POST` | `/api/v1/auth/login` | Yes (`authRoutes.js`) | N/A (Public) | `{ token, user }` | `VERIFIED — 100% MATCH` |
| `authService.getMe()` | `GET` | `/api/v1/auth/me` | Yes (`authRoutes.js`) | Yes (`Bearer <JWT>`) | `{ user }` | `VERIFIED — 100% MATCH` |
| `recoveryService.getCases()` | `GET` | `/api/v1/transactions` | Yes (`transactionRoutes.js`) | Yes (`Bearer <JWT>`) | `{ data: [...] }` | `VERIFIED — 100% MATCH` |
| `recoveryService.getCaseById()` | `GET` | `/api/v1/transactions/:id` | Yes (`transactionRoutes.js`) | Yes (`Bearer <JWT>`) | `{ data: {...} }` | `VERIFIED — 100% MATCH` |
| `recoveryService.triggerRecovery()` | `POST` | `/api/v1/recovery/:id/trigger` | Yes (`recoveryRoutes.js`) | Yes (`Bearer <JWT>`) | `{ correlation_id, recovery_case }` | `VERIFIED — 100% MATCH` |
| `analyticsService.getSummary()` | `GET` | `/api/v1/analytics/summary` | Yes (`analyticsRoutes.js`) | Yes (`Bearer <JWT>`) | `{ metrics: {...} }` | `VERIFIED — 100% MATCH` |
| `policyService.getPolicies()` | `GET` | `/api/v1/policies` | Yes (`policyRoutes.js`) | Yes (`Bearer <JWT>`) | `{ policies: {...} }` | `VERIFIED — 100% MATCH` |
| `policyService.updatePolicies()` | `PUT` | `/api/v1/policies` | Yes (`policyRoutes.js`) | Yes (`Bearer <JWT>`) | `{ status: "success", policies: {...} }` | `VERIFIED — 100% MATCH` |
| `auditService.getLogs()` | `GET` | `/api/v1/audit-logs` | Yes (`auditRoutes.js`) | Yes (`Bearer <JWT>`) | `{ data: [...] }` | `VERIFIED — 100% MATCH` |

---

## Field Name Consistency Audit

1. **Monetary Values**:
   - Backend returns `amount` (INR integer/float) and `amount_paise` (integer paise).
   - Frontend components (`OverviewView`, `KPICards`, `RecoveryCasesView`) consume `amount` for display formatting (`₹X,XXX`) and `amount_paise` for precise calculations.

2. **Probability & Risk Bands**:
   - Backend returns `recovery_probability` (float $0.0 - 1.0$) and `risk_band` (`LOW_RISK`, `MEDIUM_RISK`, `HIGH_RISK`).
   - Frontend correctly checks `recovery_probability` and renders risk badges.

3. **Multi-Tenant Isolation**:
   - `merchant_id` is extracted strictly from JWT `req.user.merchant_id` on the backend. Client-side attempts to override `merchant_id` via query/body are stripped by auth middleware.

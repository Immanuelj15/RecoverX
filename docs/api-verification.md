# RecoverX API Verification Matrix

This matrix documents the runtime verification status of every REST endpoint in RecoverX.

---

| Endpoint Method & Path | Exists | Called by UI | Auth Required | Tested via Jest | Database Verified | External Service | Verification Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `POST /api/v1/auth/login` | Yes | Yes (`LoginView`) | No | Yes | Yes (User Model) | N/A | `PASS` |
| `GET /api/v1/auth/me` | Yes | Yes (`AuthContext`) | Yes | Yes | Yes | N/A | `PASS` |
| `POST /api/v1/auth/logout` | Yes | Yes (`TopBar`) | Yes | Yes | Yes | N/A | `PASS` |
| `POST /api/v1/webhooks/razorpay` | Yes | N/A (External) | Signature | Yes | Yes (WebhookEvent) | Razorpay Webhooks | `PASS` |
| `GET /api/v1/transactions` | Yes | Yes (`RecoveryCasesView`) | Yes | Yes | Yes (Transaction) | N/A | `PASS` |
| `GET /api/v1/transactions/:id` | Yes | Yes (`CaseDetailWorkspace`) | Yes | Yes | Yes | N/A | `PASS` |
| `POST /api/v1/recovery/:id/trigger` | Yes | Yes (`CaseDetailWorkspace`) | Yes | Yes | Yes (RecoveryCase) | ML Service / Groq | `PASS` |
| `GET /api/v1/analytics/summary` | Yes | Yes (`OverviewView`) | Yes | Yes | Yes | N/A | `PASS` |
| `GET /api/v1/policies` | Yes | Yes (`PoliciesView`) | Yes | Yes | Yes (Policy) | N/A | `PASS` |
| `PUT /api/v1/policies` | Yes | Yes (`PoliciesView`) | Yes | Yes | Yes (Policy) | N/A | `PASS` |
| `GET /api/v1/audit-logs` | Yes | Yes (`AuditTrailView`) | Yes | Yes | Yes (AuditLog) | N/A | `PASS` |
| `GET /api/v1/promises` | Yes | Yes (`PromisesView`) | Yes | Yes | Yes (PromiseToPay) | N/A | `PASS` |
| `POST /api/v1/voice/update-outcome` | Yes | Yes (`VoiceCallsView`) | Yes | Yes | Yes (VoiceCall) | N/A | `PASS` |

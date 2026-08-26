# RecoverX — AI Revenue Recovery Control Plane

> **Razorpay Buildathon 2026 Submission** | Track 03 — AI Revenue Recovery
> *"Don't just detect lost revenue. Recover it."*

---

## 📌 Data Honesty Notice
**All development and evaluation data is synthetic. Razorpay Test Mode APIs are used for payment workflow demonstrations. No real customer or production payment data is used.**

---

## 🚀 Overview
RecoverX is an enterprise-grade AI-powered revenue recovery control plane. It detects payment failures and subscription drop-offs at risk, diagnoses root causes using ML predictive models, recommends bounded recovery interventions via LLM context reasoning, and enforces strict deterministic policy guardrails before executing permitted interventions.

---

## 🏗 System Architecture

```
                    RAZORPAY TEST MODE
                           │
                    Payments / Events
                           │
                           ▼
                  Node.js + Express
                           │
                    Webhook Receiver
                           │
                           ▼
                       MongoDB
                           │
                           ▼
                Revenue Risk Detector
                           │
                           ▼
                Recovery Probability ML
                           │
                           ▼
                  AI Recovery Agent
                           │
                           ▼
                  Policy/Guardrail Engine
                           │
             ┌─────────────┼─────────────┐
             ▼             ▼             ▼
          Smart Retry   Recovery      Human
                        Nudge         Escalation
             │             │             │
             └─────────────┼─────────────┘
                           ▼
                     Outcome Tracker
                           │
                           ▼
                    Audit Trail
                           │
                           ▼
                    React Dashboard
```

---

## 🛠 Tech Stack
* **Frontend:** React, Vite, Tailwind CSS, Recharts, Lucide React
* **Backend:** Node.js, Express.js, MongoDB, Mongoose
* **AI/ML Service:** Python, FastAPI, Pandas, Scikit-Learn, Joblib
* **LLM Engine:** OpenAI-compatible Provider Abstraction
* **Payments:** Razorpay Test Mode & Webhooks
* **Containerization:** Docker & Docker Compose

---

## 🚦 Current Implementation Status
- [x] **Phase 1:** Project + Git + MongoDB Foundation Setup
- [x] **Phase 2:** Mongoose Schemas (Transaction, AuditLog, WebhookEvent, PolicyConfig)
- [x] **Phase 3:** Validation + Compound Indexes
- [x] **Phase 4:** Seed Data + 10K CSV Importer Pipeline
- [x] **Phase 5:** Repositories + Database Services Layer
- [x] **Phase 6:** Recovery State Machine Engine
- [x] **Phase 7:** End-to-End Recovery Transaction Workflow Orchestrator
- [x] **Phase 8:** Compliance Audit Logging + Webhook Idempotency Layer
- [x] **Phase 9:** Real-Time Analytics Aggregation Pipelines
- [x] **Phase 10:** Database Layer Test Suite (10/10 Test Suites Passing)
- [x] **Phase 11:** Recovery Probability ML Model (Scikit-Learn / FastAPI / joblib)
- [x] **Phase 12:** AI Recovery Recommendation Agent (LLM Provider Abstraction & Safe Fallbacks)
- [x] **Phase 13:** Policy / Guardrail Engine (Max Retries, High Value Thresholds, Failure Reason Guards)
- [x] **Phase 14:** Razorpay Test Mode Integration & Webhooks (HMAC SHA256 Verification & Idempotency)
- [x] **Phase 15:** Recovery Execution Workflow Engine (Smart Retry, Nudges, Escalations, Scheduling)
- [x] **Phase 16:** Backend REST API Router (Transactions, Analytics, Policies, Audit Logs, Recovery Triggers)
- [x] **Phase 17:** Frontend Recovery Dashboard (React, Vite, Tailwind, Recharts, Real-Time Controls & Modals)
- [x] **Phase 18:** Audit Timeline UI & Compliance Inspection View (Paginated Event Tracing & JSON Payloads)
- [x] **Phase 19:** End-to-End System Integration Test Suite (Full Webhook-to-Audit-Log Lifecycle)

---

## 💻 Local Setup (Phase 1)
```bash
# Clone repository
git clone https://github.com/Immanuelj15/RecoverX.git
cd RecoverX

# Setup backend environment & dependencies
cd backend
npm install
npm test
```

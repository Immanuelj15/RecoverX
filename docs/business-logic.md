# RecoverX — Business Logic & Mathematical Specification

> **Razorpay Buildathon 2026 Submission** | **Track 03 — AI Revenue Recovery**

---

## 1. Overview & Core Principles

RecoverX operates under a strict architectural rule:
> **"XGBoost predicts. Groq reasons. Policy controls. Backend executes. Outcomes measure. Audit logs explain."**

AI models never directly move money or execute financial transactions without passing through deterministic policy guardrails.

---

## 2. Mathematical Metrics & Formulas

### 2.1 Expected Recovery Value ($E[R]$)
The Expected Recovery Value quantifies the projected financial yield of acting on a failed payment transaction:

$$E[R] = \text{Amount (INR)} \times P(\text{Recovery})$$

Where:
- $\text{Amount (INR)}$ is the transaction principal in INR.
- $P(\text{Recovery}) \in [0.0, 1.0]$ is the calibrated recovery probability output by the XGBoost ML Classifier.

*Example:*
$$\text{Amount} = ₹50,000, \quad P(\text{Recovery}) = 0.82 \implies E[R] = ₹41,000$$

### 2.2 Deterministic Priority Ranking Score
Transactions in the Recovery Queue are ordered deterministically using the Priority Ranking Score:

$$\text{Priority Score} = \text{Amount (INR)} \times P(\text{Recovery}) \times \text{Urgency Factor} \times \text{Customer Value Factor}$$

Where:
- $\text{Urgency Factor} = \begin{cases} 1.2 & \text{if } \text{retry\_count} \le 1 \\ 0.9 & \text{if } \text{retry\_count} > 1 \end{cases}$
- $\text{Customer Value Factor} = \begin{cases} 1.3 & \text{if } \text{customer\_ltv\_inr} \ge ₹20,000 \\ 1.0 & \text{otherwise} \end{cases}$

### 2.3 Paired Integer Paise Accounting
To prevent IEEE 754 floating-point rounding errors (e.g. `0.1 + 0.2 = 0.30000000000000004`), all backend calculations and database schemas store monetary amounts as paired integer paise:

$$\text{Paise Value} = \text{Math.round}(\text{Amount in INR} \times 100)$$

$$\text{INR Value} = \frac{\text{Paise Value}}{100}$$

---

## 3. Deterministic Policy Guardrail Engine Rules

Before any recommended recovery intervention is executed, the Policy Engine evaluates 5 mandatory guardrails:

| Guardrail Rule | Threshold / Condition | Action on Failure |
| :--- | :--- | :--- |
| **1. Action Allowlist** | Must be in `['SMART_RETRY', 'DELAYED_RETRY', 'PAYMENT_RECOVERY_NUDGE', 'HUMAN_ESCALATION', 'STOP']` | Reject invalid action (`BLOCKED`) |
| **2. Max Retry Cap** | $\text{retry\_count} \ge 3$ | Cease automated attempts (`STOPPED`) |
| **3. Probability Floor** | $P(\text{Recovery}) < 0.30$ | Halt execution to avoid decline fees (`BLOCKED`) |
| **4. High-Value Escalation** | $\text{Amount (INR)} \ge ₹50,000$ | Redirect to Human Review Queue (`ESCALATED`) |
| **5. Unrecoverable Failure Code** | `card_expired`, `invalid_account`, `fraud_suspected` | Immediately stop recovery (`STOPPED`) |

---

## 4. State Machine & Audit Verification

Every recovery case follows a deterministic finite state machine:

```
DETECTED ──► ANALYZING ──► PREDICTED ──► POLICY CHECK ──► ACTION ──► RECOVERED / FAILED / STOPPED
```

- **Idempotency Guarantee**: Hashes `merchant_id:payment_id:event_type` to guarantee that duplicate webhooks return `200 OK` with `status: "ignored_duplicate"`.
- **Immutable Audit Logging**: Every state transition persists `timestamp`, `payment_id`, `merchant_id`, `correlation_id`, `model_version`, `policy_decision`, and `action_result`.

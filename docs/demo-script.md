# RecoverX — 5-Minute Judge Demo Presentation Script

> **Razorpay Buildathon 2026 Submission** | **Track 03 — AI Revenue Recovery**

---

## 🎬 Minute-by-Minute Winning Demo Script

### Minute 1: Problem & Executive Command Center (0:00 – 1:00)
- **Action**: Log in to RecoverX (`demo@recoverx.ai` / `demo-password`).
- **Show on Screen**: Main **Overview Dashboard** in Dark Mode, prominent `TEST MODE` badge, and **Executive AI Briefing Banner**.
- **Spoken Script**:
  > *"Welcome to RecoverX — an Autonomous Payment Recovery Control Plane built for Track 03. Digital merchants lose up to 20% to 40% of checkout revenue every year to payment declines. Traditional recovery scripts blindly retry payments, causing decline fees and customer churn.*
  > 
  > *RecoverX solves this. Right on our Command Center, merchants see total Revenue at Risk (₹18.4L), Expected Recoverable Revenue (₹13.0L E[R]), and Verified Net Recovered Revenue (₹3.5L), backed by an AI Briefing."*

---

### Minute 2: Recovery Queue & ML Predictability (1:00 – 2:00)
- **Action**: Navigate to **Recovery Queue** (`/cases`).
- **Show on Screen**: Priority queue sorted by Expected Recovery Value ($E[R]$) and Priority Score.
- **Spoken Script**:
  > *"Our Recovery Queue prioritizes cases deterministically by Expected Recovery Value—which multiplies payment principal by machine-learning recovery probability. 
  > 
  > For example, on payment `PAY_78231` (₹42,500), our Python FastAPI ML service predicts an 82% recovery probability using an XGBoost Classifier."*

---

### Minute 3: Case Drawer, SHAP & Policy Guardrails (2:00 – 3:00)
- **Action**: Click on payment `PAY_78231` to open the **Case Detail Drawer**.
- **Show on Screen**: SHAP top feature drivers (`previous_successes: +0.34`, `network_timeout: +0.26`), Groq LLM reasoning, and Policy Decision checks.
- **Spoken Script**:
  > *"Inside the Case Drawer, RecoverX explains why AI made this prediction using SHAP factor drivers. Groq LLM then recommends a Smart UPI Retry.
  > 
  > Crucially, AI never executes directly. Our Policy Guardrail Engine checks 5 mandatory rules—verifying retry caps, probability floors, and amount thresholds. As we say: **AI recommends. Policy decides.**"*

---

### Minute 4: Human Review & Voice Recovery Agent (3:00 – 4:00)
- **Action**: Navigate to **Human Review** (`/human-review`) and **Voice Calls** (`/voice`).
- **Show on Screen**: Human Escalation Queue for payments $\ge ₹50,000$ and Hinglish Voice Call trigger.
- **Spoken Script**:
  > *"For high-value transactions over ₹50,000, Policy Rule #4 redirects cases to our Human Escalation Queue for operations sign-off.
  > 
  > For mobile-first customers, RecoverX features a programmable Hinglish Voice Recovery Agent that generates code-mixed Hindi/English scripts and plays synthesized audio nudges."*

---

### Minute 5: Audit Trail & Conclusion (4:00 – 5:00)
- **Action**: Navigate to **Audit Trail** (`/audit`) and point to JSON payload inspector and correlation IDs.
- **Spoken Script**:
  > *"Every single state transition is recorded in our Immutable Audit Log with unique correlation IDs, model versions, and policy rules checked. All monetary values are handled in integer paise to eliminate rounding error.
  > 
  > RecoverX doesn't just retry failed payments. It turns revenue at risk into verified recovered revenue while keeping every AI decision bounded and auditable. Thank you!"*

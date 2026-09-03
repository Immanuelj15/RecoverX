# RecoverX Recovery Decision Flow & Guardrails

This document outlines the step-by-step decision tree enforced by **RecoverX** when processing a failed transaction.

---

## Recovery Decision Flowchart

```mermaid
flowchart TD
    A[Payment Failure Detected] --> B{Is Failure Code Recoverable?}
    B -->|No: card_expired, invalid_account| C[Decision: STOP]
    
    B -->|Yes| D[XGBoost Predicts Probability p]
    D --> E{Is Probability p >= 0.30?}
    E -->|No: p < 0.30| C
    
    E -->|Yes| F{Is Transaction Amount >= ₹50,000?}
    F -->|Yes| G[Decision: HUMAN_ESCALATION]
    
    F -->|No| H{Is Retry Count >= 3?}
    H -->|Yes| C
    
    H -->|No| I[Groq LLM Contextual Reasoning]
    I --> J{Action in Allowlist?}
    J -->|No| K[Apply Rule-Based Fallback Action]
    J -->|Yes| L[Approved Action Dispatched]
    K --> L
    L --> M[Execute Bounded Channel: Smart Retry / WhatsApp / Call]
    M --> N[Record Outcome & Audit Log]
```

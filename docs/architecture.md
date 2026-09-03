# RecoverX — System Architecture & Workflow Specifications

This document outlines the system architecture, component topology, AI decision pipeline, policy guardrails, and data flow for **RecoverX — AI Revenue Recovery Agent**.

---

## 1. System Architecture Diagram

```mermaid
flowchart TB

    subgraph External ["External Payment Ingestion & LLM"]
        A[Razorpay / Payment Gateway]
        G_LLM[Groq LLM Reasoning API]
    end

    subgraph Webhook_Layer ["Webhook & Security Layer"]
        B[Webhook Ingestion Handler]
        C[HMAC SHA256 Signature Verification]
        D[Idempotency & Duplicate Checker]
    end

    subgraph Backend_Core ["Node.js Express Backend Service"]
        E[Recovery Control Engine]
        F[(MongoDB Database)]
        M[Deterministic Policy Engine]
        O[Recovery Action Executor]
        T[Revenue Measurement Engine]
        U[Immutable Audit Logger]
    end

    subgraph ML_Service ["Python FastAPI ML Service"]
        G[Feature Engineering Pipeline]
        H[XGBoost Recovery Predictor]
        I[SHAP Feature Explainer]
    end

    subgraph UI_Layer ["React + Vite Merchant Command Center"]
        V[Overview Dashboard]
        W[Recovery Queue & Case Workspace]
        X[Voice Calls & Promises to Pay]
        Y[Audit Trail & Guardrails Manager]
    end

    %% Webhook Ingestion Flow
    A -->|payment.failed webhook| B
    B --> C
    C -->|Verified Payload| D
    D -->|New Unique Event| E
    D -->|Duplicate Event| STOP_DUP[Ignore Duplicate]

    %% Persistence & Feature Extraction
    E --> F
    E -->|Prepare Features| G
    G --> H
    H -->|Probability Score 0-1| I
    I -->|Probability + SHAP Factors| E

    %% AI Reasoning & Policy Evaluation
    E -->|Context + ML Insights| G_LLM
    G_LLM -->|Recommended Action| M
    E -->|ML Direct Fallback| M
    M -->|Evaluate 5 Guardrails| N{Policy Decision}

    %% Policy Decisions
    N -->|Approved| O
    N -->|Escalated >= ₹50k| P[Human Approval Queue]
    N -->|Stopped / Cap Reached| Q[Stop Recovery]

    %% Execution & Outcome
    O -->|Smart Retry / WhatsApp Nudge / Hinglish Call| R[Recovery Execution Channel]
    R --> S[Recovery Outcome Verification]
    S --> T
    T --> U
    U --> F

    %% UI Consumption
    F --> V
    F --> W
    F --> X
    F --> Y
```

---

## 2. Recovery Decision Mindmap

```mermaid
mindmap
  root((RecoverX AI Agent))
    Ingestion
      Razorpay Webhook
      CSV Ingestion
      Idempotency Verification
    Intelligence
      XGBoost ML Model
        Payment Method Weight
        Historical Retry Success
        Payday Window Timing
      SHAP Explainer
        Top Positive Impact Factors
        Top Negative Impact Factors
      Groq LLM Reasoning
        Contextual Insights
        Natural Language Nudges
    Guardrails
      Action Allowlist
      Max 3 Retry Cap
      30% Probability Floor
      ₹50,000 Human Escalation Threshold
      Unrecoverable Code Blocking
    Execution Channels
      Smart UPI Instant Retry
      1-Click Cart WhatsApp Nudge
      Subscription Dunning Email
      Hinglish AI Voice Recovery Call
    Governance
      Immutable Audit Trail
      Verified Revenue Measurement
```

---

## 3. Core Architectural Principles

1. **XGBoost Predicts**: Quantitative ML predicts $0.0 \le p \le 1.0$ recovery probability.
2. **Groq Reasons**: LLM contextualizes historical patterns and generates personalized nudges.
3. **Policy Controls**: Deterministic policy engine enforces 5 non-bypassable guardrails.
4. **Backend Executes**: Node.js backend safely dispatches bounded recovery actions.
5. **Outcomes Measure**: Every recovered rupee is verified against initial revenue at risk.
6. **Audit Explains**: Complete state transitions and correlation IDs logged immutably.

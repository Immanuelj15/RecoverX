# RecoverX API Architecture & Flow Specifications

This document outlines the request execution path through the backend layers of **RecoverX**.

---

## API Layer Flow Diagram

```mermaid
sequenceDiagram
    autonumber
    actor Client as React Frontend
    participant Auth as JWT Auth Middleware
    participant Router as Express Router
    participant Controller as API Controller
    participant Service as Business Service / Pipeline
    participant DB as MongoDB Database
    participant ML as FastAPI ML Service (Port 8000)
    participant Groq as Groq LLM API
    participant Policy as Policy Engine

    Client->>Router: POST /api/v1/recovery/:id/trigger (Bearer JWT)
    Router->>Auth: Verify JWT Token & Extract merchant_id
    Auth-->>Router: Authenticated Context (req.user)
    Router->>Controller: triggerRecovery(req, res)
    Controller->>Service: processRecoveryWorkflow(payment_id, merchant_id)
    Service->>DB: Fetch Payment & Transaction Record
    DB-->>Service: Payment Record
    
    %% ML Service Call
    Service->>ML: POST /predict-recovery (Amount, Method, Retries)
    alt ML Service Online
        ML-->>Service: { recovery_probability: 0.84, top_factors: [...] }
    else ML Service Offline
        Service->>Service: Use Deterministic Probability Heuristic
    end

    %% Groq LLM Reasoning
    Service->>Groq: Request Recommendation & Reasoning
    alt Groq Online
        Groq-->>Service: { recommended_action: "SMART_RETRY", reason: "..." }
    else Groq Offline / Unconfigured
        Service->>Service: Apply Heuristic Rule Recommendation
    end

    %% Policy Engine Evaluation
    Service->>Policy: evaluatePolicy(transaction, probability, recommendation)
    Policy-->>Service: Policy Decision { approved: true, action: "SMART_RETRY" }

    %% Execution & Audit
    Service->>DB: Persist Execution Result & State Transition
    Service->>DB: Create Audit Log (Correlation ID, Action, Outcome)
    Service-->>Controller: Workflow Result Payload
    Controller-->>Client: 200 OK { status: "success", correlation_id, recovery_case }
```

---

## Verified Endpoints & Flow Summary

- `POST /api/v1/auth/login` $\to$ `authController.login` $\to$ Returns JWT Token & User Context
- `POST /api/v1/webhooks/razorpay` $\to$ `webhookController.handleWebhook` $\to$ HMAC Verification $\to$ Idempotency Check $\to$ MongoDB
- `GET /api/v1/transactions` $\to$ `transactionController.getTransactions` $\to$ Auth Middleware $\to$ Scoped MongoDB Query
- `POST /api/v1/recovery/:id/trigger` $\to$ `recoveryController.trigger` $\to$ Full 8-Step Pipeline
- `GET /api/v1/analytics/summary` $\to$ `analyticsController.getSummary` $\to$ Aggregated Integer Paise Metrics
- `GET /api/v1/audit-logs` $\to$ `auditController.getLogs` $\to$ Chronological Audit Logs

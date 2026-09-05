# 🎬 RecoverX — 5-Minute Winning Pitch Video Script & Demo Guide

> **Razorpay Buildathon 2026 Submission** | **Track 03 — AI Revenue Recovery**  
> **Video Goal**: Demonstrate a production-grade, end-to-end AI Revenue Recovery Control Plane with live working demo interactions, ML explanations, policy guardrails, and multi-channel recovery execution.

---

## 📹 Video Recording Setup & Technical Checklist

| Requirement | Recommended Setting |
| :--- | :--- |
| **Target Duration** | Exactly **4:45 – 5:00 minutes** (Do not exceed 5 minutes) |
| **Screen Resolution** | **1080p (1920x1080)** at 60 FPS |
| **Recording Software** | **OBS Studio** or **Loom** (Full Screen + Crisp Audio Microphone) |
| **Browser Setup** | Chrome in Fullscreen Mode (`http://localhost:5173`), clear extra tabs |
| **YouTube Upload** | **Unlisted** YouTube Video (Title: `RecoverX — Razorpay Buildathon 2026 Pitch Demo`) |

---

## ⏱️ Timeline & Agenda Breakdown

```
 0:00 ─── 0:45  ►  Hook & Problem Statement (Revenue Leakage in Payments)
 0:45 ─── 1:30  ►  Product Architecture & Core Principle
 1:30 ─── 3:15  ►  Live Working Demo (Overview, SHAP, Groq, Human Escalation)
 3:15 ─── 4:15  ►  Multi-Channel Execution (Smart Retry, WhatsApp, Hinglish AI Voice)
 4:15 ─── 5:00  ►  Financial Precision, Test Suite (19 Suites Passed) & Closing
```

---

## 📜 Step-by-Step Script & On-Screen Actions

### 📍 SEGMENT 1: Hook & Problem Statement (0:00 – 0:45)

**🖥️ On-Screen Action**:  
Start on the **RecoverX Overview Command Center** (`http://localhost:5173`). Have the crisp White & Blue UI displayed.

**🗣️ Voiceover Script**:
> "Hi judges, I’m excited to present **RecoverX** — an autonomous AI Revenue Recovery Control Plane built for the Razorpay Buildathon 2026.
>
> Every year, digital merchants lose up to **20 to 40% of revenue** due to payment failures, bank timeouts, card declines, and checkout drop-offs.
>
> Traditional recovery mechanisms rely on static, fixed-interval retries. This creates **retry fatigue**, incurs excessive decline fees, and exhausts retry limits on unrecoverable errors like expired cards.
>
> **RecoverX solves this** by replacing static scripts with predictive machine learning, LLM reasoning, deterministic policy guardrails, and multi-channel recovery execution."

---

### 📍 SEGMENT 2: Core Architectural Principle (0:45 – 1:30)

**🖥️ On-Screen Action**:  
Hover over the **Executive Intelligence Briefing** card and point out the 3 core layers: XGBoost, Groq LLM, and Policy Guardrails.

**🗣️ Voiceover Script**:
> "RecoverX is built on one non-negotiable architectural rule:  
> **'XGBoost predicts. Groq reasons. Policy controls. Backend executes.'**
>
> AI models in RecoverX NEVER directly trigger financial transactions without policy verification.
> 1. **Layer 1**: A trained **XGBoost Classifier** evaluates historical payment patterns and outputs exact recovery probabilities ($0.0$ to $1.0$) alongside **SHAP feature force metrics**.
> 2. **Layer 2**: A **Groq-hosted LLM** (`openai/gpt-oss-20b`) analyzes qualitative context, drafting personalized WhatsApp nudges and voice scripts with strict JSON schema validation.
> 3. **Layer 3**: A **Deterministic Policy Guardrail Engine** enforces 5 non-bypassable safety controls before any payment retry or nudge occurs."

---

### 📍 SEGMENT 3: Live Working Demo & Real-Time Pipeline (1:30 – 3:15)

#### 🔹 Step 3.1: Overview & KPI Suite
**🖥️ On-Screen Action**:  
Show the 5 hero KPI cards at the top (*Revenue at Risk*, *Recoverable Revenue*, *Recovered Revenue*, *Recovery Rate*, *Human Escalations*).

**🗣️ Voiceover Script**:
> "Here on the Overview Command Center, merchants get instant visibility into their revenue pipeline.
> All monetary accounting is computed in **integer paise** (`₹1.00 = 100 paise`) to eliminate floating-point rounding errors."

---

#### 🔹 Step 3.2: Triggering Live Recovery Simulation
**🖥️ On-Screen Action**:  
Click the **"Run Recovery Simulation"** button in the top right header. Show the real-time simulation trigger toast banner.

**🗣️ Voiceover Script**:
> "Let me trigger a live recovery simulation.
> As failed payment events stream in from Razorpay webhooks, RecoverX authenticates payloads using **HMAC SHA256** and enforces an **atomic idempotency key** to prevent duplicate processing."

---

#### 🔹 Step 3.3: Human Escalation Center
**🖥️ On-Screen Action**:  
Click on **"Human Review"** in the left sidebar. Show the pre-populated **Human-in-the-Loop Approval Queue**. Highlight the card for **₹52,000** or **₹75,000** holding for manual approval. Click **"Approve Execution"**.

**🗣️ Voiceover Script**:
> "Now let me switch to the **Human Escalation Queue**.
> Under Policy Guardrail Rule #4, any transaction of **₹50,000 or higher** is automatically held for human sign-off.
> As a merchant, I can inspect the ML confidence score, review the guardrail trigger reason, and click **Approve Execution** with a single click. Every decision is logged into an immutable audit trail."

---

#### 🔹 Step 3.4: AI Decision Center & Live Stream
**🖥️ On-Screen Action**:  
Click on **"AI Decision Center"** in the left sidebar. Show the **Live Groq Decision Stream** table displaying latency (e.g. `142ms`), JSON schema validation, and reasoning rationales.

**🗣️ Voiceover Script**:
> "Next, in the **AI Decision Center**, we can inspect qualitative reasoning logs generated by Groq.
> Notice how Groq operates with an average latency of **142ms**, verifying JSON schema contracts in real time. If the LLM service ever experiences timeouts, RecoverX gracefully falls back to deterministic rule sets without breaking pipeline execution."

---

### 📍 SEGMENT 4: Multi-Channel Recovery Execution (3:15 – 4:15)

**🖥️ On-Screen Action**:  
Click on **"Voice Calls"** or **"Recovery Queue"** in the left sidebar. Show the multi-channel execution options:
1. **Smart Retry**: Scheduled payday timing window.
2. **WhatsApp Nudge**: 1-click checkout recovery link generator.
3. **Hinglish AI Voice Recovery**: Click **"Test Voice Audio Call"** or point to the speech synthesis log.

**🗣️ Voiceover Script**:
> "RecoverX executes bounded recovery actions across 4 integrated channels:
> - **Smart UPI Retries**: Rescheduled for optimal payday windows.
> - **1-Click WhatsApp Nudges**: Direct 1-click payment links sent via WhatsApp.
> - **Dunning Emails**: Structured retry schedules for enterprise subscriptions.
> - **Hinglish AI Voice Recovery Calls**: Code-mixed Hindi and English voice calls for Indian mobile-first customers, complete with interactive speech synthesis."

---

### 📍 SEGMENT 5: Architecture, Test Verification & Closing (4:15 – 5:00)

**🖥️ On-Screen Action**:  
Switch to the **Audit Trail** view or show the terminal with **19/19 passing Jest test suites**.

**🗣️ Voiceover Script**:
> "Under the hood, RecoverX is battle-tested. Our test suite includes **19 passing Jest test suites with 83 individual tests** covering HMAC verification, idempotency locks, policy evaluation, and financial reconciliation.
>
> RecoverX bridges the gap between cutting-edge AI and strict financial governance — turning lost payment failures into verified merchant revenue.
>
> Thank you for your time and consideration!"

---

## 🎯 Quick Reference Recording Script Checklist

- [ ] **0:00 - 0:45**: Hook — 20-40% revenue lost to payment failures & static retry limitations.
- [ ] **0:45 - 1:30**: Architecture — XGBoost predicts, Groq reasons, Policy controls, Backend executes.
- [ ] **1:30 - 3:15**: Live Demo — Command Center, Simulation Trigger, Human Escalation Queue (Approve ₹52k case), AI Decision Center.
- [ ] **3:15 - 4:15**: Multi-Channel — Smart Retry, WhatsApp link, Hinglish AI Voice call demo.
- [ ] **4:15 - 5:00**: Verification — 19 Jest test suites passed, integer paise accounting, thank you closing.

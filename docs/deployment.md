# RecoverX — Deployment Guide

This guide covers step-by-step instructions to deploy the complete **RecoverX** architecture:
1. **Database**: MongoDB Atlas
2. **ML Service**: Python FastAPI + XGBoost (`ml-service/`)
3. **Backend API**: Node.js Express (`backend/`)
4. **Frontend**: React + Vite (`frontend/`)

---

## Architecture Topology

```mermaid
flowchart TD
    Client[Browser / User] -->|HTTPS| Vercel[Frontend - Vercel / Netlify]
    Vercel -->|REST API| RenderBackend[Backend API - Render / Railway Node.js]
    RenderBackend -->|PyXGBoost API| RenderML[ML Service - Render / Docker FastAPI]
    RenderBackend -->|Mongoose Driver| MongoAtlas[(MongoDB Atlas Cloud)]
    RenderBackend -->|LLM Prompts| GroqAPI[Groq Cloud API]
    Razorpay[Razorpay Payment Gateway] -->|Webhooks| RenderBackend
```

---

## Method 1: Free Cloud Hosting (Render + Vercel + Atlas) — *Recommended*

### Step 1: Deploy Database (MongoDB Atlas)

1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a Database User (e.g. `immanuel` / `immanuel`).
3. Under **Network Access**, add `0.0.0.0/0` (Allow Access from Anywhere).
4. Connection string:
   ```env
   MONGODB_URI=mongodb+srv://immanuel:immanuel@cluster0.ncymgzh.mongodb.net/recoverx?retryWrites=true&w=majority
   ```
5. Seed the production database from your local machine:
   ```bash
   cd backend
   MONGODB_URI="mongodb+srv://immanuel:immanuel@cluster0.ncymgzh.mongodb.net/recoverx?retryWrites=true&w=majority" npm run seed
   ```

---

### Step 2: Deploy ML Service (Render Web Service)

1. Connect your GitHub repository `Immanuelj15/RecoverX` to [Render](https://render.com).
2. Create a **New Web Service**:
   - **Name**: `recoverx-ml-service`
   - **Root Directory**: `ml-service`
   - **Environment**: `Python 3` (or `Docker`)
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
3. Copy the generated public service URL (e.g. `https://recoverx-ml-service.onrender.com`).

---

### Step 3: Deploy Backend API (Render Web Service)

1. Create a **New Web Service** on Render:
   - **Name**: `recoverx-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
2. Configure **Environment Variables**:
   | Variable | Value |
   | --- | --- |
   | `PORT` | `5000` |
   | `NODE_ENV` | `production` |
   | `MONGODB_URI` | `mongodb+srv://immanuel:immanuel@cluster0.ncymgzh.mongodb.net/recoverx?retryWrites=true&w=majority` |
   | `ML_SERVICE_URL` | `https://recoverx-ml-service.onrender.com` |
   | `GROQ_API_KEY` | `gsk_your_groq_api_key_here` |
   | `RAZORPAY_KEY_ID` | `rzp_test_TUgsQlLEQLgpjJ` |
   | `RAZORPAY_KEY_SECRET` | `hCOKJOcFlfWPTYloYKT2rGA8` |
   | `RAZORPAY_WEBHOOK_SECRET` | `recoverx_webhook_secret_2026` |
3. Copy the backend service URL (e.g. `https://recoverx-backend.onrender.com`).

---

### Step 4: Deploy Frontend (Vercel)

1. Connect your repository to [Vercel](https://vercel.com).
2. Configure project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Set **Environment Variable**:
   - `VITE_API_URL` = `https://recoverx-backend.onrender.com/api`
4. Click **Deploy**.

---

### Step 5: Configure Razorpay Webhooks (Live Webhook Testing)

1. Log into Razorpay Dashboard (Test Mode).
2. Go to **Settings -> Webhooks -> Add New Webhook**.
3. Set Webhook URL to:
   `https://recoverx-backend.onrender.com/api/webhooks/razorpay`
4. Secret: `recoverx_webhook_secret_2026`
5. Active Events:
   - `payment.failed`
   - `payment.authorized`
   - `payment.captured`
   - `subscription.charged`
   - `subscription.halted`

---

## Method 2: Docker Compose (Single Server / VPS)

If hosting on AWS EC2, DigitalOcean, or Linode:

1. Clone repository on the server:
   ```bash
   git clone https://github.com/Immanuelj15/RecoverX.git
   cd RecoverX
   ```

2. Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=mongodb+srv://immanuel:immanuel@cluster0.ncymgzh.mongodb.net/recoverx?retryWrites=true&w=majority
   GROQ_API_KEY=gsk_your_groq_api_key_here
   RAZORPAY_KEY_ID=rzp_test_TUgsQlLEQLgpjJ
   RAZORPAY_KEY_SECRET=hCOKJOcFlfWPTYloYKT2rGA8
   RAZORPAY_WEBHOOK_SECRET=recoverx_webhook_secret_2026
   VITE_API_URL=http://YOUR_SERVER_IP:5000/api
   ```

3. Launch all services:
   ```bash
   docker-compose up -d --build
   ```

4. Verify service health:
   - Frontend: `http://YOUR_SERVER_IP:3000`
   - Backend Health: `http://YOUR_SERVER_IP:5000/health`
   - ML Health: `http://YOUR_SERVER_IP:8000/health`

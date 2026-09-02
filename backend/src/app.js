const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { getConnectionStatus } = require('./config/db');

const app = express();

const webhookRoutes = require('./routes/webhookRoutes');
const authRoutes = require('./routes/authRoutes');
const recoveryRoutes = require('./routes/recoveryRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const batchRoutes = require('./routes/batchRoutes');
const promiseRoutes = require('./routes/promiseRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const policyRoutes = require('./routes/policyRoutes');
const auditRoutes = require('./routes/auditRoutes');

// Security Headers via Helmet
app.use(helmet({
  contentSecurityPolicy: false, // Disabled for flexible API integration
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// CORS Configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Razorpay-Signature']
}));

app.use(express.json());
app.use(morgan('dev'));

// Simple NoSQL Injection Sanitizer
app.use((req, res, next) => {
  const sanitize = (obj) => {
    if (!obj || typeof obj !== 'object') return;
    Object.keys(obj).forEach((key) => {
      if (key.startsWith('$')) {
        delete obj[key];
      } else if (typeof obj[key] === 'object') {
        sanitize(obj[key]);
      }
    });
  };
  if (req.body) sanitize(req.body);
  if (req.query) sanitize(req.query);
  next();
});

// Rate Limiting (Disabled during automated testing to avoid Supertest throttling)
if (process.env.NODE_ENV !== 'test') {
  const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // Limit each IP to 200 requests per 15 minutes
    standardHeaders: true,
    legacyHeaders: false,
    message: { status: 'error', message: 'Too many requests, please try again later.' }
  });

  const webhookLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 1000, // Allow up to 1000 webhook events per minute
    standardHeaders: true,
    legacyHeaders: false,
    message: { status: 'error', message: 'Webhook rate limit exceeded.' }
  });

  app.use('/api/webhooks', webhookLimiter);
  app.use('/api/v1/webhooks', webhookLimiter);
  app.use('/api', globalLimiter);
}

// Mount API routes (Standard & V1 Aliases)
const mountRoutes = (prefix) => {
  app.use(`${prefix}/auth`, authRoutes);
  app.use(`${prefix}/webhooks`, webhookRoutes);
  app.use(`${prefix}/recovery`, recoveryRoutes);
  app.use(`${prefix}/dashboard`, dashboardRoutes);
  app.use(`${prefix}/batch`, batchRoutes);
  app.use(`${prefix}/analytics`, analyticsRoutes);
  app.use(`${prefix}/promises`, promiseRoutes);
  app.use(`${prefix}/transactions`, transactionRoutes);
  app.use(`${prefix}/policies`, policyRoutes);
  app.use(`${prefix}/audit-logs`, auditRoutes);
};

mountRoutes('/api');
mountRoutes('/api/v1');

// Health check endpoint
app.get('/health', (req, res) => {
  const dbStatus = getConnectionStatus();
  const dbStatusMap = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };

  res.status(200).json({
    status: 'UP',
    service: 'recoverx-backend',
    timestamp: new Date().toISOString(),
    database: {
      state: dbStatusMap[dbStatus] || 'unknown',
      readyState: dbStatus
    }
  });
});

module.exports = app;

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { getConnectionStatus } = require('./config/db');

const app = express();

const webhookRoutes = require('./routes/webhookRoutes');
const recoveryRoutes = require('./routes/recoveryRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const batchRoutes = require('./routes/batchRoutes');

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
  app.use('/api', globalLimiter);
}

// Mount API routes
app.use('/api/webhooks', webhookRoutes);
app.use('/api/recovery', recoveryRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/batch', batchRoutes);

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

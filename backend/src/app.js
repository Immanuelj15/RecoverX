const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { getConnectionStatus } = require('./config/db');

const app = express();

const webhookRoutes = require('./routes/webhookRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const policyRoutes = require('./routes/policyRoutes');
const auditRoutes = require('./routes/auditRoutes');

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Mount API routes
app.use('/api/v1/webhooks', webhookRoutes);
app.use('/api/v1/transactions', transactionRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/policies', policyRoutes);
app.use('/api/v1/audit-logs', auditRoutes);

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

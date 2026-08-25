const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { getConnectionStatus } = require('./config/db');

const app = express();

const webhookRoutes = require('./routes/webhookRoutes');

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/v1/webhooks', webhookRoutes);

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

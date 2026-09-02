const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Merchant = require('../models/Merchant');
const logger = require('../utils/logger');

const JWT_SECRET = process.env.JWT_SECRET || 'recoverx_jwt_secret_key_2026';

/**
 * Authentication middleware that verifies signed JWT tokens
 * and enforces merchant identity & data isolation.
 */
const requireAuth = async (req, res, next) => {
  try {
    let token = null;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        status: 'error',
        error: 'Unauthorized',
        message: 'Authentication token required. Please sign in.'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    req.merchant_id = decoded.merchant_id || decoded.merchant_code || 'merchant_demo_001';

    // Verify merchant status in DB if Mongoose is connected
    if (mongoose.connection.readyState === 1) {
      try {
        const merchant = await Merchant.findOne({
          $or: [
            { merchant_code: req.merchant_id },
            { email: decoded.email }
          ]
        });

        if (merchant) {
          if (!merchant.is_active || merchant.status === 'suspended') {
            return res.status(403).json({
              status: 'error',
              error: 'Forbidden',
              message: 'Merchant account is inactive or suspended.'
            });
          }
          req.merchant = merchant;
        }
      } catch (dbErr) {
        logger.debug(`Auth middleware DB lookup fallback: ${dbErr.message}`);
      }
    }

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'error',
        error: 'Unauthorized',
        message: 'Session expired. Please sign in again.'
      });
    }
    return res.status(401).json({
      status: 'error',
      error: 'Unauthorized',
      message: 'Invalid authentication token.'
    });
  }
};

module.exports = {
  requireAuth,
  JWT_SECRET
};

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Merchant = require('../models/Merchant');
const { JWT_SECRET } = require('../middleware/authMiddleware');
const logger = require('../utils/logger');

// Hardcoded fallback bcrypt hash for 'demo-password' to ensure instant test/demo readiness
const DEMO_PASSWORD_PLAIN = 'demo-password';
const DEMO_PASSWORD_HASH = bcrypt.hashSync(DEMO_PASSWORD_PLAIN, 10);

class AuthController {
  /**
   * POST /api/v1/auth/login
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          status: 'error',
          message: 'Email and password are required.'
        });
      }

      const normalizedEmail = String(email).trim().toLowerCase();
      let merchant = null;

      if (mongoose.connection.readyState === 1) {
        try {
          merchant = await Merchant.findOne({ email: normalizedEmail });
        } catch (err) {
          logger.debug(`DB lookup error in login: ${err.message}`);
        }
      }

      // Check if credentials match merchant in DB or default demo merchant
      let isValidPassword = false;
      let merchantCode = 'merchant_demo_001';
      let merchantName = 'RecoverX Demo Merchant';
      let merchantRole = 'MERCHANT_ADMIN';

      if (merchant) {
        if (!merchant.is_active || merchant.status === 'suspended') {
          return res.status(403).json({
            status: 'error',
            message: 'Merchant account is inactive or suspended.'
          });
        }
        if (merchant.password_hash) {
          isValidPassword = await bcrypt.compare(password, merchant.password_hash);
        } else {
          // If password_hash is not set yet in DB, allow demo-password
          isValidPassword = (password === DEMO_PASSWORD_PLAIN);
        }
        merchantCode = merchant.merchant_code;
        merchantName = merchant.name;
        merchantRole = merchant.role || 'MERCHANT_ADMIN';
      } else if (normalizedEmail === 'demo@recoverx.ai' || normalizedEmail === 'demo@recoverflow.ai') {
        isValidPassword = (password === DEMO_PASSWORD_PLAIN) || (await bcrypt.compare(password, DEMO_PASSWORD_HASH));
      }

      if (!isValidPassword) {
        return res.status(401).json({
          status: 'error',
          message: 'Invalid email or password.'
        });
      }

      // Update last_login_at timestamp
      if (merchant) {
        try {
          merchant.last_login_at = new Date();
          await merchant.save();
        } catch (e) {
          // Ignore save errors in mock environments
        }
      }

      // Generate JWT Token
      const payload = {
        merchant_id: merchantCode,
        merchant_code: merchantCode,
        email: normalizedEmail,
        name: merchantName,
        role: merchantRole
      };

      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

      logger.info(`Merchant authenticated successfully: ${normalizedEmail} [${merchantCode}]`);

      return res.status(200).json({
        status: 'success',
        message: 'Authentication successful',
        token,
        user: {
          merchant_id: merchantCode,
          name: merchantName,
          email: normalizedEmail,
          role: merchantRole
        }
      });
    } catch (error) {
      logger.error(`Login error: ${error.message}`);
      return res.status(500).json({
        status: 'error',
        message: 'Internal server error during authentication.'
      });
    }
  }

  /**
   * GET /api/v1/auth/me
   */
  async getMe(req, res) {
    return res.status(200).json({
      status: 'success',
      user: req.user
    });
  }

  /**
   * POST /api/v1/auth/logout
   */
  async logout(req, res) {
    return res.status(200).json({
      status: 'success',
      message: 'Logged out successfully.'
    });
  }
}

module.exports = new AuthController();

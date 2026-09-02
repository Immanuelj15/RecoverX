const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { requireAuth } = require('../middleware/authMiddleware');

router.post('/login', authController.login.bind(authController));
router.get('/me', requireAuth, authController.getMe.bind(authController));
router.post('/logout', authController.logout.bind(authController));

module.exports = router;

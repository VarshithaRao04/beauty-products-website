const express = require('express');
const { getPool } = require('../config/database');
const { requireAuth } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/profile', requireAuth, async (req, res, next) => {
  try {
    const [rows] = await getPool().execute(
      'SELECT user_id, name, email, created_at FROM users WHERE user_id = ? LIMIT 1',
      [req.user.userId]
    );
    if (!rows.length) {
      return res.status(404).json({ success: false, error: 'User account was not found.' });
    }
    return res.json({ success: true, user: rows[0] });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;

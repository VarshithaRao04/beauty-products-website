const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getPool } = require('../config/database');
const { cookieOptions } = require('../middleware/auth.middleware');

const router = express.Router();
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post('/register', async (req, res, next) => {
  try {
    const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = typeof req.body.password === 'string' ? req.body.password : '';

    if (name.length < 2 || name.length > 100) {
      return res.status(400).json({ success: false, error: 'Name must contain 2 to 100 characters.' });
    }
    if (!EMAIL_PATTERN.test(email) || email.length > 150) {
      return res.status(400).json({ success: false, error: 'Please enter a valid email address.' });
    }
    if (password.length < 8 || password.length > 72) {
      return res.status(400).json({ success: false, error: 'Password must contain 8 to 72 characters.' });
    }

    const pool = getPool();
    const [existing] = await pool.execute('SELECT user_id FROM users WHERE email = ? LIMIT 1', [email]);
    if (existing.length) {
      return res.status(409).json({ success: false, error: 'An account with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
      [name, email, passwordHash]
    );

    return res.status(201).json({
      success: true,
      message: 'Registration successful. Please log in.',
      user: { user_id: result.insertId, name, email }
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ success: false, error: 'An account with this email already exists.' });
    }
    return next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = typeof req.body.password === 'string' ? req.body.password : '';
    if (!EMAIL_PATTERN.test(email) || !password) {
      return res.status(400).json({ success: false, error: 'Enter a valid email and password.' });
    }

    const [rows] = await getPool().execute(
      'SELECT user_id, name, email, password_hash, created_at FROM users WHERE email = ? LIMIT 1',
      [email]
    );
    if (!rows.length || !(await bcrypt.compare(password, rows[0].password_hash))) {
      return res.status(401).json({ success: false, error: 'Incorrect email or password.' });
    }

    const user = rows[0];
    const token = jwt.sign(
      { userId: user.user_id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );
    res.cookie('beauty_bliss_token', token, cookieOptions());
    return res.json({
      success: true,
      message: 'Login successful.',
      user: { user_id: user.user_id, name: user.name, email: user.email, created_at: user.created_at }
    });
  } catch (error) {
    return next(error);
  }
});

router.post('/logout', (_req, res) => {
  res.clearCookie('beauty_bliss_token', cookieOptions());
  return res.json({ success: true, message: 'Logged out successfully.' });
});

module.exports = router;

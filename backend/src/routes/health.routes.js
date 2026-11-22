const express = require('express');
const { testDatabaseConnection } = require('../config/database');

const router = express.Router();

// Confirms that the Express API is running.
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Beauty Bliss API is running.',
    timestamp: new Date().toISOString()
  });
});

// Checks the MySQL connection separately so the API can start before MySQL is configured.
router.get('/database', async (req, res) => {
  try {
    await testDatabaseConnection();
    res.json({ success: true, message: 'MySQL connection successful.' });
  } catch (error) {
    console.error('Database health check failed:', error.message);
    res.status(503).json({
      success: false,
      message: 'The API is running, but MySQL is not connected. Check your backend .env settings and make sure MySQL is running.'
    });
  }
});

module.exports = router;

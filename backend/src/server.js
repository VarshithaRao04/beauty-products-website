require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const healthRoutes = require('./routes/health.routes');
const authRoutes = require('./routes/auth.routes');
const usersRoutes = require('./routes/users.routes');
const ordersRoutes = require('./routes/orders.routes');
const { closeDatabasePool } = require('./config/database');

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  console.error('JWT_SECRET is missing or too short. Set a random secret of at least 32 characters in backend/.env.');
  process.exit(1);
}

const app = express();
const PORT = Number(process.env.PORT || 5000);
const allowedOrigins = (process.env.FRONTEND_ORIGINS || '')
  .split(',').map((origin) => origin.trim()).filter(Boolean);

app.disable('x-powered-by');
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Origin is not allowed by CORS.'));
  },
  credentials: true
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { success: false, error: 'Too many attempts. Please try again in 15 minutes.' }
});

app.get('/', (_req, res) => res.json({ success: true, message: 'Welcome to the Beauty Bliss API.' }));
app.use('/api/health', healthRoutes);
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/orders', ordersRoutes);

app.use((req, res) => res.status(404).json({ success: false, error: 'API endpoint not found.' }));
app.use((error, req, res, next) => {
  console.error('API error:', error.message);
  if (error.message === 'Origin is not allowed by CORS.') {
    return res.status(403).json({ success: false, error: error.message });
  }
  if (error.code === 'ECONNREFUSED' || error.code === 'ER_BAD_DB_ERROR' || error.code === 'ER_ACCESS_DENIED_ERROR') {
    return res.status(503).json({ success: false, error: 'Database unavailable. Check that MySQL is running and backend/.env is configured.' });
  }
  return res.status(500).json({ success: false, error: 'An unexpected server error occurred.' });
});

const server = app.listen(PORT, () => {
  console.log(`Beauty Bliss API running at http://localhost:${PORT}`);
  console.log(`API health: http://localhost:${PORT}/api/health`);
  console.log(`Database health: http://localhost:${PORT}/api/health/database`);
});

async function shutdown() {
  console.log('\nShutting down Beauty Bliss API...');
  server.close(async () => {
    try { await closeDatabasePool(); } finally { process.exit(0); }
  });
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

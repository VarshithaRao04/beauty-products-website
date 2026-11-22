const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  const token = req.cookies?.beauty_bliss_token;
  if (!token) {
    return res.status(401).json({ success: false, error: 'Please log in to continue.' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: payload.userId, email: payload.email };
    return next();
  } catch (_error) {
    res.clearCookie('beauty_bliss_token', cookieOptions());
    return res.status(401).json({ success: false, error: 'Your session has expired. Please log in again.' });
  }
}

function cookieOptions() {
  const isProduction = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
    maxAge: 24 * 60 * 60 * 1000
  };
}

module.exports = { requireAuth, cookieOptions };

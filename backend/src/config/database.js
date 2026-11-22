const mysql = require('mysql2/promise');

let pool;

function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'beauty_bliss',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      decimalNumbers: true
    });
  }

  return pool;
}

async function testDatabaseConnection() {
  const connection = await getPool().getConnection();
  try {
    await connection.ping();
    return true;
  } finally {
    connection.release();
  }
}

async function closeDatabasePool() {
  if (pool) {
    await pool.end();
    pool = undefined;
  }
}

module.exports = { getPool, testDatabaseConnection, closeDatabasePool };

const mysql = require('mysql2/promise');

function send(res, status, body) {
  res.status(status).setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  return res.json(body);
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return send(res, 405, { success: false, message: 'Method not allowed.' });
  }

  // Explicit allowlist prevents this endpoint becoming an arbitrary network scanner.
  const allowedHosts = (process.env.DB_ALLOWED_HOSTS || '')
    .split(',')
    .map(v => v.trim().toLowerCase())
    .filter(Boolean);

  if (!allowedHosts.length) {
    return send(res, 503, {
      success: false,
      message: 'Server setup incomplete: DB_ALLOWED_HOSTS is not configured in Vercel.'
    });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = null; }
  }

  const host = String(body?.host || '').trim().toLowerCase();
  const database = String(body?.dbname || '').trim();
  const user = String(body?.username || '').trim();
  const password = String(body?.password || '');

  if (!host || !database || !user) {
    return send(res, 400, { success: false, message: 'Please provide host, database name and username.' });
  }

  if (!/^[a-z0-9.-]{1,253}$/.test(host) || host.startsWith('.') || host.endsWith('.') ||
      !/^[a-zA-Z0-9_$-]{1,64}$/.test(database) ||
      !/^[a-zA-Z0-9_$.-]{1,128}$/.test(user) || password.length > 256) {
    return send(res, 400, { success: false, message: 'Invalid input format.' });
  }

  if (!allowedHosts.includes(host)) {
    return send(res, 403, { success: false, message: 'This database host is not permitted by the server administrator.' });
  }

  let connection;
  try {
    connection = await mysql.createConnection({
      host,
      port: 3306,
      user,
      password,
      database,
      connectTimeout: 7000,
      enableKeepAlive: false,
      multipleStatements: false
    });
    await connection.query('SELECT 1');
    return send(res, 200, { success: true, message: 'MySQL connection successful! Database is reachable.' });
  } catch (err) {
    // Do not return raw database errors; they may expose server or account details.
    return send(res, 200, { success: false, message: 'Connection failed. Check the host, database name, username, password and remote MySQL access settings.' });
  } finally {
    if (connection) {
      try { await connection.end(); } catch {}
    }
  }
};
const crypto = require('crypto');

function getRequestId(req) {
  if (req && req.id) return req.id;
  return 'req_' + crypto.randomBytes(6).toString('hex');
}

function ok(res, data = {}, message = 'Request completed successfully', statusCode = 200, req = null) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    meta: {
      requestId: getRequestId(req),
      timestamp: new Date().toISOString()
    }
  });
}

function fail(res, statusCode, errorCode, message, details = [], req = null) {
  return res.status(statusCode).json({
    success: false,
    message,
    errorCode,
    details: Array.isArray(details) ? details : [details],
    meta: {
      requestId: getRequestId(req)
    }
  });
}

module.exports = { ok, fail };
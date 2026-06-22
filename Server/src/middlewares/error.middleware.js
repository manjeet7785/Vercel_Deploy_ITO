const { fail } = require('../utils/response');
const logger = require('../utils/logger');

function errorHandler(err, req, res, next) {
  logger.error(`Unhandled error at ${req.method} ${req.url}:`, err);

  const statusCode = err.status || err.statusCode || 500;
  const errorCode = err.errorCode || 'SERVER_ERROR';
  const message = err.message || 'An unexpected error occurred';
  const details = err.details || [];

  return fail(res, statusCode, errorCode, message, details, req);
}

module.exports = { errorHandler };

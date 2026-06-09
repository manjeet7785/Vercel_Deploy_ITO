function ok(res, data, statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    data
  });
}

function fail(res, statusCode, errorCode, message) {
  return res.status(statusCode).json({
    success: false,
    errorCode,
    message
  });
}

module.exports = { ok, fail };
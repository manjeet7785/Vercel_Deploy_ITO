export const errorHandler = (err, req, res, next) => {
  console.error(`System Exception Logging Target: ${err.stack}`);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Production Runtime Exception',
    errorCode: err.code || 'SERVER_ERROR'
  });
};

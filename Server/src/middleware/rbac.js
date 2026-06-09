function rbac(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, errorCode: 'AUTH_INVALID_CREDENTIALS', message: 'Unauthorized' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, errorCode: 'RBAC_FORBIDDEN', message: 'Forbidden' });
    }

    next();
  };
}

module.exports = rbac;

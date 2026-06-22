const { fail } = require('../utils/response');

function checkPermission(...permissionNames) {
  return (req, res, next) => {
    if (!req.user) {
      return fail(res, 401, 'AUTH_INVALID_CREDENTIALS', 'Unauthorized: Authentication required', [], req);
    }
    
    
    if (req.user.role === 'ADMIN') {
      return next();
    }
    
    
    const hasAnyPermission = permissionNames.some(perm => req.user[perm] === true);
    
    if (hasAnyPermission) {
      return next();
    }
    
    return fail(
      res,
      403,
      'PERMISSION_DENIED',
      `Forbidden: Access restricted. Requires at least one permission in [${permissionNames.join(', ')}]`,
      [],
      req
    );
  };
}

module.exports = checkPermission;

import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      return next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Not authorized, token validation failed', errorCode: 'AUTH_INVALID_TOKEN' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'No bearer token located inside headers', errorCode: 'AUTH_MISSING_TOKEN' });
  }
};
